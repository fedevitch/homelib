export type PaginatedApiResponse<T> = {
    data: Array<T>,
    page: number,
    count: number,
}

export type ApiResponse = {
    message: string,
}