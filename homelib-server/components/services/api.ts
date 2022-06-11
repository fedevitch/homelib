import { Request, ApiResponse } from "./request"

export const signUp = async(data: any = {}): Promise<ApiResponse> => {
    return Request.post('/api/signup', data)
}

export const login = async(data: any = {}): Promise<ApiResponse> => {
    return Request.post('/api/login', data)
}