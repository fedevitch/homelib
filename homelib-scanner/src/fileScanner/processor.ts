import logger from "../logger";
import { FileData } from "."
import { FileExtensions } from "../directoryScanner/fileExtensions";
import processPDF from "./pdfProcessor";
import processDjvu from "./djvuProcessor";
import processFb2 from "./fb2Processor";
import processEpub from "./epubProcessor";

export type ProcessResult = {
    rawText: string,
    meta: object,
    pages: number
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
        default:
            logger.error("Unknown format");
            return {} as ProcessResult;    
    }
    
}

export default fileProcessor;