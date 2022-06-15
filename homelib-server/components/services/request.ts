import httpStatus from 'http-status-codes';

export type ApiResponse = {
    message: string,
}

export type PaginatedApiResponse = {
    data: Array<any>,
    page: number,
    pages: number,
}

export type RequestOptions = {
    skipCredentials: boolean
}

export interface ApiErrorResponse extends ApiResponse {}

export class Request {
    public static send = async(method: string, url: string, data = {}, options?: RequestOptions): Promise<any> => {
        const params: RequestInit = { 
            headers: {
                'Content-Type': 'application/json'            
            },
            credentials: 'include',
            method
        }
        if(method !== 'GET' && data) {
            let _data: BodyInit
            try {
                _data = JSON.stringify(data)
            } catch {
                throw { message: 'Client data error' }
            }
            params.body = _data;
        }
        const res = await fetch(url, params)
        if(res.status !== httpStatus.OK) {
            if(res.status === httpStatus.UNAUTHORIZED) {
                window.location.href = '/login'
            }
            const contentTypeHeaders = res.headers.get('Content-Type') || ''
            console.log(contentTypeHeaders)    
            if(contentTypeHeaders.indexOf('application/json') > -1) {
                const errorResponse = await res.json()
                throw errorResponse as ApiErrorResponse       
            }
            if(contentTypeHeaders.indexOf('text/html') > -1) {
                const errorResponse = { message: 'Error occured' }
                throw errorResponse as ApiErrorResponse       
            }
        }
    
        return res.json()        
    }
    
    public static get = async(url: string) => this.send('GET', url)
    public static post = async(url: string, data = {}, options?: RequestOptions) => this.send('POST', url, data, options)
    public static put = async(url: string, data = {}, options?: RequestOptions) => this.send('PUT', url, data, options)
    public static delete = async(url: string, data = {}, options?: RequestOptions) => this.send('DELETE', url, data, options)
}