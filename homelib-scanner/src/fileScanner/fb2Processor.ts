import _ from 'lodash';
import { readFile } from 'fs/promises';
const vivaParserFb2 = require('viva-parser-fb2');
import { ProcessResult } from './processor';
import logger from "../logger";

const parseFb2 = async (fileName: string): Promise<ProcessResult> => {
    const file = await readFile(fileName, 'utf-8');
    const parser = new vivaParserFb2();
    const fb2 = parser.parse(file);
    if(!fb2){
        logger.error('Incorrect format');
    }
    const meta = _.omit(parser.book, 'text', 'link', 'binary', 'annotation');
    meta['annotation'] = parser.get_formatted_annotation({format: 'plain'});
    const text = parser.get_formatted_text({format: 'plain'});
    const pages = 0;
    return { rawText: _.take(text, 3000).join(''), meta, pages};
}

const processFb2 = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing fb2 ${fileName}`);
    return parseFb2(fileName);
}

export default processFb2;