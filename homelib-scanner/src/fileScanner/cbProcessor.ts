import _ from 'lodash';
import { ProcessResult } from './processor';
import logger from "../logger";
const comic = require('comic-info');

const parseComicBook = async (fileName: string): Promise<ProcessResult> => {
    const _meta = await new comic({path: fileName});
    return { rawText: '', meta: _.omit(_meta, 'dir'), pages: Number.parseInt(_.get(_meta, 'pages', '0')) };          
}

const processComicBook = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing comic book ${fileName}`);
    return parseComicBook(fileName);
}

export default processComicBook;