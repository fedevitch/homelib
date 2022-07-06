import _ from 'lodash';
import { ProcessResult } from './processor';
import logger from "../logger";

const parseRtf = async (fileName: string): Promise<ProcessResult> => {
    return new Promise((resolve, reject) => {
        
               // if(err) reject(err);
                resolve({ rawText: ''.replaceAll(/(<([^>]+)>)/ig, ''), meta: {}, pages: 0 });
                   
    });    
}

const processRtf = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing epub ${fileName}`);
    return parseRtf(fileName);
}

export default processRtf;