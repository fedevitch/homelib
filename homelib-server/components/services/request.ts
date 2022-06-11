import httpStatus from 'http-status-codes';

export type ApiResponse = {
    message: string
}

export interface ApiErrorResponse extends ApiResponse {}

export class Request {
    public static send = async(method: string, url: string, data = {}): Promise<ApiResponse> => {
        const params: RequestInit = { 
            headers: {
                'Content-Type': 'application/json'            
            },
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
    public static post = async(url: string, data = {}) => this.send('POST', url, data)
    public static put = async(url: string, data = {}) => this.send('PUT', url, data)
    public static delete = async(url: string, data = {}) => this.send('DELETE', url, data)
}