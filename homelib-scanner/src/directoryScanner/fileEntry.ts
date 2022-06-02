import { Dirent } from 'fs';
import { FileExtensions } from './fileExtensions';
export class FileEntry {
    constructor(_dirent: Dirent, _path: string) {
        this.name = _dirent.name;
        this.path = _path;
        this.format = FileExtensions.getFormat(this.name);
        this.supported = this.format !== null;
    }

    public getFullName = ():string => `${this.path}/${this.name}`;

    public path: string;
    public name: string;
    public format: string | null;
    public supported: boolean;
}