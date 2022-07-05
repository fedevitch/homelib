import _ from 'lodash';
const PDFparser = require("../pdf2json");
import logger from "../logger";
import { ProcessResult } from './processor';
import config from '../scanConfig';

const parsePdf = async (fileName: string): Promise<ProcessResult> => {
    return new Promise((resolve, reject) => {
        let rawText = "", meta = {}, pages = 0;
        const pdfParserStream = new PDFparser();
        pdfParserStream.on("error", reject);
        pdfParserStream.on("pdfParser_dataError", reject);
        pdfParserStream.on("pdfParser_dataReady", (rawData: object) => {
            logger.info(`Done parsing data from ${fileName}`);            
            meta = _.get(rawData, "Meta");
            const pagesArray = _.get(rawData, "Pages", []);
            pages = pagesArray.length;
            const selectedPages = [ ..._.take(pagesArray, config.TAKE_START_PAGES), ..._.takeRight(pagesArray, config.TAKE_END_PAGES) ];            
            _.forEach(selectedPages, page => {                
                _.forEach(_.get(page, "Texts"), textItem => {                    
                    _.forEach(_.get(textItem, "R"), fragment => {                        
                        rawText += _.get(fragment, "T");
                    });
                });
            });
            resolve({ rawText: decodeURIComponent(rawText), meta, pages});
        });       

        pdfParserStream.loadPDF(fileName);
    });
}

const processPDF = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing pdf ${fileName}`);
    return parsePdf(fileName);
}

export default processPDF;