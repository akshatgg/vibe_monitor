export interface ToastData {
  id: string
  message: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  duration?: number
  title?: string
}

class ToastManager {
  private toasts: Set<string> = new Set()
  private container: HTMLElement | null = null
  private recentMessages: Map<string, number> = new Map()
  private readonly DUPLICATE_THRESHOLD = 3000 // 3 seconds

  private createContainer() {
    if (this.container && document.body.contains(this.container)) {
      return this.container
    }

    this.container = document.createElement('div')
    this.container.id = 'toast-container'
    this.container.style.cssText = `
      position: fixed;
      top: var(--space-lg, 1.5rem);
      right: var(--space-lg, 1.5rem);
      z-index: var(--z-tooltip, 1070);
      display: flex;
      flex-direction: column;
      gap: var(--space-sm, 0.5rem);
      max-width: 22rem;
      min-width: 18rem;
      pointer-events: none;
    `
    document.body.appendChild(this.container)
    return this.container
  }

  private getVariantStyles(variant: ToastData['variant'] = 'default') {
    const baseStyles = `
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      width: 100%;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid;
      font-size: 14px;
      line-height: 1.5;
      font-family: "Inter", system-ui, sans-serif;
      font-weight: 500;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
                  0 4px 6px -2px rgba(0, 0, 0, 0.2),
                  0 0 0 1px rgba(255, 255, 255, 0.03);
      transition: all 300ms ease-in-out;
      transform: translateX(100%);
      opacity: 0;
      position: relative;
      overflow: hidden;
    `

    const variants = {
      default: `
        background-color: #1a1a1a;
        border-color: rgba(255, 255, 255, 0.1);
        color: #f1f5f9;
      `,
      destructive: `
        background-color: #1a1a1a;
        border-color: #ef4444;
        color: #f87171;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
                    0 4px 6px -2px rgba(0, 0, 0, 0.2),
                    0 0 0 1px #ef4444,
                    0 0 10px rgba(239, 68, 68, 0.1);
      `,
      success: `
        background-color: #1a1a1a;
        border-color: #10b981;
        color: #34d399;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
                    0 4px 6px -2px rgba(0, 0, 0, 0.2),
                    0 0 0 1px #10b981,
                    0 0 10px rgba(16, 185, 129, 0.1);
      `,
      warning: `
        background-color: #1a1a1a;
        border-color: #f59e0b;
        color: #fbbf24;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
                    0 4px 6px -2px rgba(0, 0, 0, 0.2),
                    0 0 0 1px #f59e0b,
                    0 0 10px rgba(245, 158, 11, 0.1);
      `
    }

    return baseStyles + (variants[variant] || variants.default)
  }

  private getIcon(variant: ToastData['variant'] = 'default') {
    const iconStyle = `
      width: 1rem;
      height: 1rem;
      margin-top: 0.125rem;
      margin-right: 0.75rem;
      flex-shrink: 0;
    `

    const icons = {
      destructive: `
        <svg style="${iconStyle}" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      `,
      success: `
        <svg style="${iconStyle}" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      `,
      warning: `
        <svg style="${iconStyle}" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      `,
      default: ''
    }

    return icons[variant] || ''
  }

  private removeToast(id: string) {
    const toastElement = document.getElementById(`toast-${id}`)
    if (toastElement) {
      // Slide out animation
      toastElement.style.transform = 'translateX(100%)'
      toastElement.style.opacity = '0'

      setTimeout(() => {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement)
        }
        this.toasts.delete(id)

        // Clean up container if no toasts left
        if (this.toasts.size === 0 && this.container) {
          document.body.removeChild(this.container)
          this.container = null
        }
      }, 300)
    }
  }

  private isDuplicate(message: string): boolean {
    const now = Date.now()
    const messageKey = message.toLowerCase().trim()

    // Clean up old messages
    for (const [key, timestamp] of this.recentMessages.entries()) {
      if (now - timestamp > this.DUPLICATE_THRESHOLD) {
        this.recentMessages.delete(key)
      }
    }

    // Check if this message was shown recently
    if (this.recentMessages.has(messageKey)) {
      return true
    }

    // Record this message
    this.recentMessages.set(messageKey, now)
    return false
  }

  show(data: Omit<ToastData, 'id'>) {
    if (typeof window === 'undefined') return ''

    // Check for duplicate messages
    if (this.isDuplicate(data.message)) {
      return ''
    }

    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const toastData: ToastData = {
      id,
      duration: 5000,
      variant: 'default',
      ...data
    }

    this.toasts.add(id)

    const container = this.createContainer()

    // Create toast element
    const toastElement = document.createElement('div')
    toastElement.id = `toast-${id}`
    toastElement.style.cssText = this.getVariantStyles(toastData.variant)

    const closeButton = `
      <button
        onclick="document.getElementById('toast-${id}').style.transform='translateX(100%)'; document.getElementById('toast-${id}').style.opacity='0'; setTimeout(() => { const el = document.getElementById('toast-${id}'); if(el && el.parentNode) el.parentNode.removeChild(el); }, 300);"
        style="
          margin-left: 12px;
          padding: 4px;
          border: none;
          background: rgba(255, 255, 255, 0.05);
          cursor: pointer;
          opacity: 0.6;
          transition: all 150ms ease-in-out;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        "
        onmouseover="this.style.opacity='1'; this.style.background='rgba(255, 255, 255, 0.1)'"
        onmouseout="this.style.opacity='0.6'; this.style.background='rgba(255, 255, 255, 0.05)'"
      >
        <svg style="width: 12px; height: 12px;" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    `

    toastElement.innerHTML = `
      <div style="display: flex; align-items: flex-start; flex: 1; min-width: 0;">
        ${this.getIcon(toastData.variant)}
        <div style="flex: 1; min-width: 0;">
          ${toastData.title ? `<div style="font-weight: 600; margin-bottom: 4px; color: currentColor; font-size: 14px;">${toastData.title}</div>` : ''}
          <div style="color: currentColor; opacity: 0.85; word-wrap: break-word; line-height: 1.4; font-size: 13px;">${toastData.message}</div>
        </div>
      </div>
      ${closeButton}
      <div style="
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: ${toastData.variant === 'destructive' ? '#ef4444' :
          toastData.variant === 'success' ? '#10b981' :
          toastData.variant === 'warning' ? '#f59e0b' :
          '#3F5ECC'};
        animation: toast-progress ${toastData.duration || 5000}ms linear forwards;
        transform-origin: left;
      "></div>
      <style>
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      </style>
    `

    container.appendChild(toastElement)

    // Trigger slide-in animation
    setTimeout(() => {
      toastElement.style.transform = 'translateX(0)'
      toastElement.style.opacity = '1'
    }, 10)

    // Auto remove after duration
    if (toastData.duration && toastData.duration > 0) {
      setTimeout(() => {
        this.removeToast(id)
      }, toastData.duration)
    }

    return id
  }

  error(message: string, options?: Partial<ToastData>) {
    return this.show({
      message,
      variant: 'destructive',
      title: 'Error',
      ...options
    })
  }

  success(message: string, options?: Partial<ToastData>) {
    return this.show({
      message,
      variant: 'success',
      title: 'Success',
      ...options
    })
  }

  warning(message: string, options?: Partial<ToastData>) {
    return this.show({
      message,
      variant: 'warning',
      title: 'Warning',
      ...options
    })
  }

  dismiss(id: string) {
    this.removeToast(id)
  }

  dismissAll() {
    const toastIds = Array.from(this.toasts)
    toastIds.forEach(id => this.removeToast(id))
  }
}

export const toastManager = new ToastManager()