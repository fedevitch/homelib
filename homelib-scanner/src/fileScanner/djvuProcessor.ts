// djvudump <filename>
// djvutxt -page=1-5 <filename>

import logger from "../logger";
import { ProcessResult } from './processor';
import config from '../scanConfig';
import { spawn } from "child_process";
import _ from 'lodash';
import { randomUUID } from 'crypto';
import { rm } from 'fs/promises';
import { extractPreview, getPagesOCR } from './pdfProcessor';

const djvuExtractPreview = async(fileName: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const previewPdfImageFileName = `${randomUUID().replaceAll('-', '')}.pdf`;
        const dumpProcess = spawn('ddjvu', ['-format=pdf', '-page=1', fileName, previewPdfImageFileName]);
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', reject);
        dumpProcess.stderr.on('error', reject);
        dumpProcess.stdout.on('error', reject);
        dumpProcess.on('close', async () => {
            const buffer = await extractPreview(previewPdfImageFileName, 25);
            await rm(previewPdfImageFileName);
            resolve(buffer)
        });
    })
}

const djvuGetPagesOCR = async(fileName: string, pages: number): Promise<Array<Buffer>> => {
    return new Promise((resolve, reject) => {
        const previewPdfImageFileName = `/tmp/${randomUUID().replaceAll('-', '')}.pdf`;
        const dumpProcess = spawn('ddjvu', ['-format=pdf', 
            `-page=1-${config.TAKE_START_PAGES},${pages - config.TAKE_END_PAGES}-${pages}`,
            '-mode=black',
            fileName, previewPdfImageFileName]);
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', reject);
        dumpProcess.stderr.on('error', reject);
        dumpProcess.on('close', async () => {
            const fileNames = await getPagesOCR(previewPdfImageFileName, 1, config.TAKE_START_PAGES + config.TAKE_END_PAGES);
            await rm(previewPdfImageFileName);            
            resolve(fileNames)
        });    
    });
}

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

    const preview = await djvuExtractPreview(fileName);
    let pagesToOCR = Array<Buffer>();
    if(!rawText && config.OCR){
        pagesToOCR = await djvuGetPagesOCR(fileName, pages);
    }

    return { rawText, meta, pages, preview, pagesToOCR };
}

const processDjvu = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing djvu ${fileName}`);
    return parseDjvu(fileName);
}

export default processDjvu;