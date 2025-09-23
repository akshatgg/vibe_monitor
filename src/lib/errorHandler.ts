import { tokenService } from '@/services/tokenService'
import { toastManager } from '@/lib/toastManager'

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
      toastManager.error(message)
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
      toastManager.error(message)
    }
  }

  static handleGenericError(error: string, options: ErrorHandlerOptions = {}) {
    const { showAlert = true, customMessage } = options

    console.error('Error:', error)

    if (showAlert) {
      const message = customMessage || 'An error occurred. Please try again.'
      toastManager.error(message)
    }
  }

}

export const errorHandler = ErrorHandler