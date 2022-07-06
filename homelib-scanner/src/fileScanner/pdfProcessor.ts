import _ from 'lodash';
import { spawn } from "child_process";
import logger from "../logger";
import { ProcessResult } from './processor';
import config from '../scanConfig';

const getPdfInfo = async(fileName: string): Promise<object> => {
    return new Promise((resolve, reject) => {
        const dumpProcess = spawn('pdfinfo', [fileName])
        let infoDump = "";
        dumpProcess.stdout.on('data', data => infoDump += data);
        dumpProcess.on('close', () => {
            const info = { infoDump };
            infoDump.split('\n')
                    .forEach(v => { 
                        const name = v.split(':')[0]; 
                        const value = v.substring(v.indexOf(':') + 1).trim(); 
                        info[name] = value; 
                    });

            resolve(info);
        });
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', err => reject(err.toString()));
    })
}

const getPdfText = async(fileName: string, startPage: number, endPage: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const dumpProcess = spawn('pdftotext', ['-f', startPage.toString(), '-l', endPage.toString(), fileName, '-'])
        let text = "";
        dumpProcess.stdout.on('data', data => text += data);
        dumpProcess.on('close', () => resolve(text));
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', err => reject(err.toString()));
    })
}

const parsePdf = async (fileName: string): Promise<ProcessResult> => {    
    let pages = 0;
    const meta = await getPdfInfo(fileName);
    if(meta['Pages']) {
        pages = Number.parseInt(meta['Pages']);
    }
    const bookIndex = await getPdfText(fileName, 1, config.TAKE_START_PAGES);
    const bookAppendix = await getPdfText(fileName, pages - config.TAKE_END_PAGES, pages);
    
    return { rawText: bookIndex + bookAppendix, meta, pages};
        
}

const processPDF = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing pdf ${fileName}`);
    return parsePdf(fileName);
}

export default processPDF;