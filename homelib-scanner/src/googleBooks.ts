import https from 'https';
import { GoogleBookAPIResponse } from "./models/volumeInfo";
import { FileData } from "./models/fileData";

export const getVolumeInfo = async (data: FileData): Promise<GoogleBookAPIResponse> => {
    const isbnData = data.getIsbn();
    const name = data.entry.name;
    const q = isbnData ? isbnData.isbn : name;
    return new Promise((resolve, reject) => {
        const responseHandler = (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(JSON.parse(data) as GoogleBookAPIResponse));
        }
        const request = https.get(`https://www.googleapis.com/books/v1/volumes?q=${q}`, responseHandler);
        request.on('error', reject);
    });
}