import _ from 'lodash';
import { ProcessResult } from './processor';
import logger from "../logger";

const parseEpub = async (fileName: string): Promise<ProcessResult> => {
    return { rawText: '', meta: {}, pages: 0};
}

const processEpub = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing epub ${fileName}`);
    return parseEpub(fileName);
}

export default processEpub;