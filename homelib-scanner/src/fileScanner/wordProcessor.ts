import _ from 'lodash';
import { ProcessResult } from './processor';
import logger from "../logger";
import { readFile } from 'fs/promises';
import WordExtractor from 'word-extractor';
const getDocumentProperties = require('office-document-properties');

const parseMeta = (file: Buffer): Promise<object> => new Promise((resolve, reject) => {
    getDocumentProperties.fromBuffer(file, (err, meta) => {
        if(err) reject(err)
        resolve(meta)
    })
})

const parseWord = async (fileName: string): Promise<ProcessResult> => {
    const file = await readFile(fileName);
    const meta = await parseMeta(file);
    const wordExtractor = new WordExtractor();
    const extracted = await wordExtractor.extract(file);
    const text = extracted.getBody();
    return { rawText: _.take(text, 3000).join(''), meta, pages: 0 }
}

const processWord = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing Word ${fileName}`);
    return parseWord(fileName);
}

export default processWord;