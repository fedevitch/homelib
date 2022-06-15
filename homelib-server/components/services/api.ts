import { Request, ApiResponse, PaginatedApiResponse } from "./request"
import { removeCookies } from "cookies-next"

export const signUp = async(data: any = {}): Promise<ApiResponse> => {
    return Request.post('/api/signup', data, { skipCredentials: true })
}

export const login = async(data: any = {}): Promise<ApiResponse> => {
    return Request.post('/api/login', data, { skipCredentials: true })
}

export const logout = () => {
    removeCookies('Token')
    window.location.href = '/login'
}

export const fetchMain = async (): Promise<PaginatedApiResponse> => {
    return Request.get('/api')
}

export const fetchBooks = async (): Promise<PaginatedApiResponse> => {
    return Request.get('/api/books')
}