import { opendir } from 'fs/promises';
import { FileEntry } from './fileEntry';

const processDir = async (directory: string): Promise<Array<FileEntry>> => {

    const files = [];

    try {        
        const dir = await opendir(directory);
        for await (const dirent of dir) {
          
          if(dirent.isFile()) {
              const fileEntry = new FileEntry(dirent, dir.path);
              if(fileEntry.supported){
                files.push(fileEntry);
              }
          }
          if(dirent.isDirectory()) {
            const subDirFiles = await processDir(`${directory}/${dirent.name}`);
            files.push(...subDirFiles);  
          }
        }
      } catch (err) {
        console.error(err);
      }


    return Promise.resolve(files);
}

const scan = async (directory: string): Promise<Array<FileEntry>> => {
    console.log('Scanning folders...');

    const fileList = await processDir(directory);

    console.log(`Scanning folders done. Found ${fileList.length} files.`)

    return Promise.resolve(fileList);

}

export default scan;