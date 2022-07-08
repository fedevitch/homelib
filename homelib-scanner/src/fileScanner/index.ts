import { Stats } from 'fs';
import { stat } from 'fs/promises';
import _ from 'lodash';
import logger from '../logger';
import { FileEntry } from '../directoryScanner/fileEntry';
import fileProcessor from './processor';
import { FileExtensions } from '../directoryScanner/fileExtensions';

type IsbnValues = {
    isbn: string;
    isbn10: string;
    isbn13: string;
}

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

    public getIsbn = (): IsbnValues | null => {
        if(this.entry.format === FileExtensions.Formats.fb2){
            return _.get(this.meta, 'isbn', null);
        }
        if(this.summary !== ""){
            const idx = this.summary.indexOf('ISBN');
            if(idx === -1) return null;
            const isbn13 = this.summary.substring(idx, idx + 23);
            return {
                isbn: isbn13.replaceAll(/\D/gim,''),
                isbn10: isbn13.substring(0, 18),
                isbn13
            }
        }
        return null;
    }
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