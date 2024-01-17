export interface WebSocketResponse {
  success: boolean
  statusCode: number
  payload: object | null
}

export interface WebSocketError {
  success: boolean
  statusCode: number
  error: string
  message: string | null
}
