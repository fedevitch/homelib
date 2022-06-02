import { Stats } from 'fs';
import { stat } from 'fs/promises';
import { FileEntry } from '../directoryScanner/fileEntry';

export class FileData {
    constructor(fileEntry: FileEntry) {
        this.entry = fileEntry;

    }

    public setStats = (stats: Stats) => {
        this.size = stats.size;
        this.createdOnDisk = stats.ctime;

    }

    public entry: FileEntry;
    public size: Number = 0;
    public createdOnDisk: Date = new Date();
}

const scan = async (file: FileEntry): Promise<FileData> => {

    console.log(`scanning file: ${file.getFullName()}`);

    const fileData = new FileData(file);

    const stats = await stat(file.getFullName());
    fileData.setStats(stats);

    return Promise.resolve(fileData);

}

export default scan;