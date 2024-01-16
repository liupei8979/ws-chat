export interface ApiResponse<T> {
  success: boolean
  statusCode: number | null
  message: string | null
  data?: T | null
}

export interface ApiError {
  success: boolean
  statusCode?: number | null
  message: string | null
  error?: string | string[] | null
}
