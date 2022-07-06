import _ from 'lodash';
import { ProcessResult } from './processor';
import logger from "../logger";
import { createReadStream } from 'fs';
const parseRTF = require('@iarna/rtf-parser');

const parseRtf = async (fileName: string): Promise<ProcessResult> => {
    return new Promise((resolve, reject) => {
        parseRTF.stream(createReadStream(fileName), (err, doc) => {
            if(err) reject(err);
            // @ts-ignore
            const rawText = _.take(doc.content, 100).map((c) => c.value).join('');
            resolve({ rawText, meta: {}, pages: 0 });
        })
    });    
}

const processRtf = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing RTF ${fileName}`);
    return parseRtf(fileName);
}

export default processRtf;