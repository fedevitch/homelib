import httpStatus from 'http-status-codes';

type ApiResponse = {
    message: string
}

export const signUp = async(data: any = {}): Promise<ApiResponse> => {
    const res = await fetch('/api/signup', { 
        headers: {
            'Content-Type': 'application/json'            
        },
        method: 'POST', body: JSON.stringify(data) 
    })
    if(res.status !== httpStatus.OK) {    
        const errorResponse = await res.json()
        throw errorResponse        
    }
    return res.json()
}