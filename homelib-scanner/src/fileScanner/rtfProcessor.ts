import _ from 'lodash';
import { ProcessResult } from './processor';
import logger from "../logger";
import { readFile } from 'fs/promises';
const parseRTF = require('rtf-parser');

const parseRtf = async (file: string): Promise<ProcessResult> => {
    return new Promise((resolve, reject) => {
        parseRTF.string(file, (err, doc) => {
            if(err) reject(err);
            console.log(doc)
            // @ts-ignore           
            const rawText = _.take(doc.content, 100).map((c) => c.value).join('');
            resolve({ rawText, meta: {}, pages: 0 });
        })
    });    
}

const processRtf = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing RTF ${fileName}`);
    const file = await readFile(fileName);
    return parseRtf(file.toString());
}

export default processRtf;