import logger from "../logger";
import { FileData } from "."
import { FileExtensions } from "../directoryScanner/fileExtensions";
import pdfProcessor from "./pdfProcessor";

const fileProcessor = async (fileData: FileData) => {
    const format = FileExtensions.getFormat(fileData.entry.name);
    const fullName = fileData.entry.getFullName();

    switch(format) {
        case FileExtensions.Formats.pdf:
            logger.debug("pdf");
            await pdfProcessor(fullName);
            break;
        case FileExtensions.Formats.djvu:
            break;
        case FileExtensions.Formats.fb2:
            break;
        default:
            logger.error("Unknown format");
            break;    
    }

    return fileData;
}

export default fileProcessor;