// djvudump <filename>
// djvutxt -page=1-5 <filename>

import logger from "../logger";
import { ProcessResult } from './processor';
import config from '../scanConfig';
import { spawn } from "child_process";
import _ from 'lodash';

const djvuDump = async(fileName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const dumpProcess = spawn('djvudump', [fileName])
        let dump = "";
        dumpProcess.stdout.on('data', data => dump += data);
        dumpProcess.on('close', () => resolve(dump));
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', reject);
    })
}

const djvuTxt = async(fileName: string, pages: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const dumpProcess = spawn('djvutxt', [`-page=1-${config.TAKE_START_PAGES},${pages - config.TAKE_END_PAGES}-${pages}`, fileName])
        let text = "";
        dumpProcess.stdout.on('data', data => text += data);
        dumpProcess.on('close', () => resolve(text));
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', reject);
    })
}

const parseDjvu = async (fileName: string): Promise<ProcessResult> => {  
    const dump = await djvuDump(fileName);     
    const numbers = dump.match(/([0-9])\w+/g);
    const pages = Number.parseInt(_.get(numbers, '3', 0));
    const meta = { pages, files: Number.parseInt(_.get(numbers, '2', 0)), dump: dump.substring(0, 300) };
    const rawText = await djvuTxt(fileName, pages);    

    return { rawText, meta, pages};
}

const processDjvu = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing djvu ${fileName}`);
    return parseDjvu(fileName);
}

export default processDjvu;