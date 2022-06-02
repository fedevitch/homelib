import { FileEntry } from '../directoryScanner/fileEntry';

export class FileData {
    constructor(fileEntry: FileEntry) {
        this.entry = fileEntry;

    }

    public entry: FileEntry;
    public size: Number = 0;
}

const scan = async (file: FileEntry): Promise<FileData> => {

    console.log('scanning file');

    const fileData = new FileData(file);

    return Promise.resolve(fileData);

}

export default scan;