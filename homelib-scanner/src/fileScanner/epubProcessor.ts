import _ from 'lodash';
import EPub from 'epub';
import { ProcessResult } from './processor';
import logger from "../logger";

const parseEpub = async (fileName: string): Promise<ProcessResult> => {
    return new Promise((resolve, reject) => {
        const epub = new EPub(fileName);
        epub.on('end', () => {
            const meta = _.pick(epub, 'metadata', 'manifest', 'flow', 'toc');
            epub.getChapter(_.get(epub, 'flow[0].id'), (err, chapterText) => {
                if(err) reject(err);
                resolve({ rawText: chapterText.replaceAll(/(<([^>]+)>)/ig, ''), meta, pages: 0 });
            })
        });
        epub.parse();        
    });    
}

const processEpub = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing epub ${fileName}`);
    return parseEpub(fileName);
}

export default processEpub;