import { tokenService } from '@/services/tokenService'

export interface ErrorHandlerOptions {
  showAlert?: boolean
  redirectToAuth?: boolean
  customMessage?: string
}

export class ErrorHandler {
  static handleAuthError(error: string, options: ErrorHandlerOptions = {}) {
    const { showAlert = true, redirectToAuth = true, customMessage } = options

    console.error('Authentication error:', error)

    // Clear tokens on auth errors
    tokenService.clearTokens()

    // Show error message if needed
    if (showAlert) {
      const message = customMessage || 'Authentication failed. Please log in again.'
      this.showError(message)
    }

    // Redirect to auth page
    if (redirectToAuth && typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.href = '/auth'
      }, 1000) // Small delay to show error message
    }
  }

  static handleNetworkError(error: string, options: ErrorHandlerOptions = {}) {
    const { showAlert = true, customMessage } = options

    console.error('Network error:', error)

    if (showAlert) {
      const message = customMessage || 'Network error occurred. Please check your connection.'
      this.showError(message)
    }
  }

  static handleGenericError(error: string, options: ErrorHandlerOptions = {}) {
    const { showAlert = true, customMessage } = options

    console.error('Error:', error)

    if (showAlert) {
      const message = customMessage || 'An error occurred. Please try again.'
      this.showError(message)
    }
  }

  private static showError(message: string) {
    // Create a simple error notification using browser APIs
    // This could be enhanced with a proper toast system later
    if (typeof window !== 'undefined') {
      // Create temporary error element
      const errorDiv = document.createElement('div')
      errorDiv.className = 'fixed top-4 right-4 z-50 max-w-sm p-4 bg-red-50 border border-red-200 rounded-lg shadow-lg'
      errorDiv.innerHTML = `
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">${message}</p>
          </div>
          <div class="ml-auto pl-3">
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-red-400 hover:text-red-500">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      `

      document.body.appendChild(errorDiv)

      // Auto remove after 5 seconds
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv)
        }
      }, 5000)
    }
  }
}

export const errorHandler = ErrorHandler