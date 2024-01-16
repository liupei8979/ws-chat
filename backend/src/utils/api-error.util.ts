import { ApiError } from '@just-chat/types'

export function createApiError(message: string, error: string): ApiError {
  return {
    success: false,
    message,
    error,
  }
}
