import logger from "../logger";
import { FileData } from "."
import { FileExtensions } from "../directoryScanner/fileExtensions";
import pdfProcessor from "./pdfProcessor";
import djvuProcessor from "./djvuProcessor";

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
            return pdfProcessor(fullName);            
        case FileExtensions.Formats.djvu:
            logger.debug("djvu");
            return djvuProcessor(fullName);
        case FileExtensions.Formats.fb2:
            return {} as ProcessResult;
        default:
            logger.error("Unknown format");
            return {} as ProcessResult;    
    }
    
}

export default fileProcessor;