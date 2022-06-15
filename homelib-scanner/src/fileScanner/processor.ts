import logger from "../logger";
import { FileData } from "."
import { FileExtensions } from "../directoryScanner/fileExtensions";
import pdfProcessor from "./pdfProcessor";

export type ProcessResult = {
    rawText: string,
    meta: object
}

const fileProcessor = async (fileData: FileData): Promise<ProcessResult> => {
    const format = FileExtensions.getFormat(fileData.entry.name);
    const fullName = fileData.entry.getFullName();

    switch(format) {
        case FileExtensions.Formats.pdf:
            logger.debug("pdf");
            return pdfProcessor(fullName);            
        case FileExtensions.Formats.djvu:
            return {} as ProcessResult;
        case FileExtensions.Formats.fb2:
            return {} as ProcessResult;
        default:
            logger.error("Unknown format");
            return {} as ProcessResult;    
    }
    
}

export default fileProcessor;