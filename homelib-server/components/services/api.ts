import { Request } from "./request"
import { ApiResponse, PaginatedApiResponse } from "../schemas/apiResponses"
import { removeCookies } from "cookies-next"
import { BookStats } from "../../services/books"

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

export const fetchMain = async (): Promise<BookStats> => {
    return Request.get('/api')
}

export const fetchBooks = async (page = 1, perPage = 20): Promise<PaginatedApiResponse> => {
    return Request.get(`/api/books?page=${page}&perPage=${perPage}`)
}