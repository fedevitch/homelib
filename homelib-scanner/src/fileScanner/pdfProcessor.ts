import _ from 'lodash';
const PDFparser = require("pdf2json");
import logger from "../logger";
import { FileData } from ".";

const TAKE_START_PAGES = 5;
const TAKE_END_PAGES = 3;

const parsePdf = async (fileName: string): Promise<[string, object]> => {
    return new Promise((resolve, reject) => {
        logger.debug(fileName);
        let rawText = "", meta = {};
        const pdfParserStream = new PDFparser();
        pdfParserStream.on("pdfParser_dataError", reject);
        pdfParserStream.on("pdfParser_dataReady", (rawData: object) => {
            logger.info(`Done parsing data from ${fileName}`);            
            meta = _.get(rawData, "Meta");
            const pages = _.get(rawData, "Pages", []);
            const selectedPages = [ ..._.take(pages, TAKE_START_PAGES), ..._.takeRight(pages, TAKE_END_PAGES) ];
            _.forEach(selectedPages, page => {
                _.forEach(_.get(page, "Texts"), textItem => {
                    _.forEach(_.get(textItem, "R"), fragment => rawText += _.get(fragment, "T"));
                });
            });
            resolve([decodeURIComponent(rawText), meta]);
        });       

        pdfParserStream.loadPDF(fileName);
    });
}

const processPDF = async (fileName: string) => {

    const [rawText, meta] = await parsePdf(fileName);

    logger.info(rawText);
    logger.info(meta);

}

export default processPDF;