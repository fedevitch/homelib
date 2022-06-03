import { Stats } from 'fs';
import { stat } from 'fs/promises';
import logger from '../logger';
import { FileEntry } from '../directoryScanner/fileEntry';
import fileProcessor from './processor';

export class FileData {
    constructor(fileEntry: FileEntry) {
        this.entry = fileEntry;
    }

    public setStats = (stats: Stats) => {
        this.size = stats.size;
        this.createdOnDisk = stats.ctime;
    }

    public setMeta = (meta: object) => {
        this.meta = meta;
    }

    public entry: FileEntry;
    public size: Number = 0;
    public createdOnDisk: Date = new Date();
    public meta = {};
}

const scan = async (file: FileEntry): Promise<FileData> => {

    logger.info(`scanning file: ${file.getFullName()}`);

    const fileData = new FileData(file);

    try {

        const stats = await stat(file.getFullName());
        fileData.setStats(stats);

        await fileProcessor(fileData);



    } catch (e) {
        logger.error(e);
    }

    return fileData;
}

export default scan;