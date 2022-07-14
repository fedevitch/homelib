import { Stats } from "fs";
import _ from "lodash";
import { FileEntry } from "../directoryScanner/fileEntry";
import { FileExtensions } from "../directoryScanner/fileExtensions";

export type IsbnValues = {
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