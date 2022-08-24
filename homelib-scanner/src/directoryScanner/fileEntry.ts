import { Dirent } from 'fs';
import { FileExtensions } from './fileExtensions';
export class FileEntry {
    constructor(_dirent: Dirent, _path: string) {
        this.name = _dirent.name;        
        this.path = _path;
        this.format = FileExtensions.getFormat(this.name);
        this.supported = this.format !== null;
        this.fileNameWithoutExt = this.name.replace(`.${this.format}`, '');
    }

    public getFullName = ():string => `${this.path}/${this.name}`;

    public path: string;
    public name: string;
    public fileNameWithoutExt: string;
    public format: string | null;
    public supported: boolean;
}