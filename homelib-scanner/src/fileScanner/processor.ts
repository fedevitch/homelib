import logger from "../logger";
import { FileData } from "../models/fileData"
import { FileExtensions } from "../directoryScanner/fileExtensions";
import processPDF from "./pdfProcessor";
import processDjvu from "./djvuProcessor";
import processFb2 from "./fb2Processor";
import processEpub from "./epubProcessor";
import processWord from "./wordProcessor";
import processRtf from "./rtfProcessor";
import processComicBook from "./comicbookProcessor";

export type ProcessResult = {
    rawText: string,
    meta: object,
    pages: number,
    preview?: Buffer,
    pagesToOCR?: String[]
}

const fileProcessor = async (fileData: FileData): Promise<ProcessResult> => {
    const format = FileExtensions.getFormat(fileData.entry.name);
    const fullName = fileData.entry.getFullName();

    switch(format) {
        case FileExtensions.Formats.pdf:
            logger.debug("pdf");
            return processPDF(fullName);            
        case FileExtensions.Formats.djvu:
        case FileExtensions.Formats.djv:    
            logger.debug("djvu");
            return processDjvu(fullName);
        case FileExtensions.Formats.fb2:
            logger.debug("fb2");
            return processFb2(fullName);
        case FileExtensions.Formats.epub:
            logger.debug("epub");
            return processEpub(fullName);
        case FileExtensions.Formats.chm:
            logger.debug("chm");
            return { pages: 0 } as ProcessResult; // chm is proprietary
        case FileExtensions.Formats.docx:
        case FileExtensions.Formats.doc:
            logger.debug("Word");
            return processWord(fullName);
        case FileExtensions.Formats.rtf:
            //logger.debug("RTF");
            //return processRtf(fullName);
            return { pages: 0 } as ProcessResult;
        case FileExtensions.Formats.cbr:
        case FileExtensions.Formats.cbz:
            logger.debug("ComicBook");
            return processComicBook(fullName);
        default:
            logger.error("Unknown format");
            return {} as ProcessResult;    
    }
    
}

export default fileProcessor;