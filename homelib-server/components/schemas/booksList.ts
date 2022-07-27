import { VolumeInfo } from './volumeInfo';
export default interface BookListItem {
    id: number;
    name: string;
    format: string;
    // summary: string;
    isbn: string;
    pages: number;
    catalogs: Array<String>
}
export interface BookData {
    id: number;
    name: String;
    fullName: String;
    catalogs: Array<String>;
    format: String;
    size: number;
    createdOnDisk: Date;
    summary: String;
    meta: any;
    pages: number;
    isbn: String;
    isbn10: String;
    isbn13: String;
    volumeInfo: VolumeInfo;
}