import { Request, ApiResponse, PaginatedApiResponse } from "./request"

export const signUp = async(data: any = {}): Promise<ApiResponse> => {
    return Request.post('/api/signup', data, { skipCredentials: true })
}

export const login = async(data: any = {}): Promise<ApiResponse> => {
    return Request.post('/api/login', data, { skipCredentials: true })
}

export const fetchMain = async (): Promise<PaginatedApiResponse> => {
    return Request.get('/api')
}