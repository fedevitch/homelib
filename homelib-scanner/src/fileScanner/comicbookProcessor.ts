import _ from 'lodash';
import { readFile, rm } from 'fs/promises';
import { ProcessResult } from './processor';
import logger from "../logger";
const comic = require('comic-info');
const {Archive} = require('libarchive.js/main.js');

const extractPreview = async (fileName: string): Promise<Buffer> => {
    const archive = await Archive.open(fileName);
    const pages = await archive.getFilesArray();
    const file = pages[0].extract();
    const preview = await readFile(file.name);
    await rm(file.name);
    return preview;
}

const parseComicBook = async (fileName: string): Promise<ProcessResult> => {
    const _meta = await new comic({path: fileName});
    const preview = await extractPreview(fileName);
    return { rawText: '', meta: _.omit(_meta, 'dir'), pages: Number.parseInt(_.get(_meta, 'pages', '0')), preview };          
}

const processComicBook = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing comic book ${fileName}`);
    return parseComicBook(fileName);
}

export default processComicBook;