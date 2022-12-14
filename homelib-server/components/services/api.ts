import { Request } from "./request"
import { ApiResponse, PaginatedApiResponse } from "../schemas/apiResponses"
import { removeCookies } from "cookies-next"
import { BookStats } from "../../components/schemas/bookStats"
import { BooksFilter } from "../schemas/apiRequests"
import BookListItem, { BookData } from "../schemas/booksList"

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

export const fetchBooks = async (filter: BooksFilter, page = 1, perPage = 20): Promise<PaginatedApiResponse<BookListItem>> => {
    return Request.get(`/api/books?page=${page}&perPage=${perPage}&searchString=${filter.searchString}&format=${filter.format}&ISBN=${filter.ISBN}`)
}

export const fetchBook = async(id: number): Promise<BookData> => {
    return Request.get(`/api/books/${id}`)
}