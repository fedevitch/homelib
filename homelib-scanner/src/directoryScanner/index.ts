import { Dirent } from 'fs';
import { opendir } from 'fs/promises';

export class FileEntry {
    constructor(_dirent: Dirent, _path: string) {
        this.name = _dirent.name;
        this.path = _path;
    }

    public getFullName = ():string => `${this.path}${this.name}`;

    public path: string;
    public name: string;
}

const processDir = async (directory: string): Promise<Array<FileEntry>> => {

    const files = [];

    try {        
        const dir = await opendir(directory);
        for await (const dirent of dir) {
          
          if(dirent.isFile()) {
            files.push(new FileEntry(dirent, dir.path));
          }
        }
      } catch (err) {
        console.error(err);
      }


    return Promise.resolve(files);
}

const scan = async (directory: string): Promise<Array<FileEntry>> => {
    console.log('scanning directories');

    const fileList = await processDir(directory);

    return Promise.resolve(fileList);

}

export default scan;