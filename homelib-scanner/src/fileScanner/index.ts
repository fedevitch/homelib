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

    public setSummary = (summary: string) => this.summary = summary;

    public entry: FileEntry;
    public size: number = 0;
    public pages: number = 0;
    public createdOnDisk: Date = new Date();
    public meta = {};
    public summary = "";
}

const scan = async (file: FileEntry): Promise<FileData> => {

    logger.debug(`scanning file: ${file.getFullName()}`);

    const fileData = new FileData(file);

    try {

        const stats = await stat(file.getFullName());
        fileData.setStats(stats);

        const processResult = await fileProcessor(fileData);
        fileData.setSummary(processResult.rawText);
        fileData.setMeta(processResult.meta);
        fileData.pages = processResult.pages;
        
    } catch (e) {
        logger.error('Scanner error');
        logger.error(e);
    }

    return fileData;
}

export default scan;