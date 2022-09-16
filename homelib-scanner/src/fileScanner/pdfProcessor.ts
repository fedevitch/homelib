import _ from 'lodash';
import { spawn } from "child_process";
import { randomUUID } from 'crypto';
import { readFile, rm } from 'fs/promises';
import logger from "../logger";
import { ProcessResult } from './processor';
import config from '../scanConfig';
const pngToJpeg = require('png-to-jpeg');

export const extractPreview = async(fileName: string, ratio = 50): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        let previewFileName = `/tmp/${randomUUID().replaceAll('-', '')}`;
        const convertProcess = spawn('pdftopng', ['-f', '1', '-l', '1', '-r', ratio.toString(), fileName, previewFileName]);
        convertProcess.on('error', reject);
        convertProcess.stderr.on('data', reject);
        convertProcess.stderr.on('error', reject);
        convertProcess.on('close', async () => {
            previewFileName += '-000001.png';
            const blob = await readFile(previewFileName);
            await rm(previewFileName);
            const preview = await pngToJpeg({quality: 90})(blob);
            resolve(preview);
        });
    });
}

export const getPagesOCR = async(fileName: string, firstPage: number, lastPage: number): Promise<Array<String>> => {
    logger.debug('getPagesOCR');
    return new Promise((resolve, reject) => {
        const fileNames = Array<string>();
        const prefix = `/tmp/${randomUUID().replaceAll('-', '')}`;
        for(let i = firstPage; i < lastPage; i++){
            const fileName = `${prefix}-${_.padStart(i.toString(), 6, '0')}.png`;            
            fileNames.push(fileName);
            
        }
        const convertProcess = spawn('pdftopng', ['-f', firstPage.toString(), '-l', lastPage.toString(), fileName, prefix]);
        convertProcess.on('error', reject);
        convertProcess.stderr.on('data', reject);
        convertProcess.stderr.on('error', reject);
        convertProcess.on('close', () => resolve(fileNames));
        // async () => {
        //     const data = Array<Buffer>();
        //     for(const fileName of fileNames){
        //         logger.debug('readFile');
        //         try {
        //             const buffer = await readFile(fileName);
        //             data.push(buffer);
        //             logger.debug('rm');
        //             await rm(fileName);
        //         } catch(e) {
        //             logger.error(`Error with file ${fileName}`);
        //         }
        //     }
        //     resolve(data);           
        // });
    });
}

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
    const meta = await getPdfInfo(fileName);
    const pages = Number.parseInt(_.get(meta, 'Pages', '0'));
    const bookIndex = await getPdfText(fileName, 1, config.TAKE_START_PAGES);
    const bookAppendix = await getPdfText(fileName, pages - config.TAKE_END_PAGES, pages);

    const preview = await extractPreview(fileName);
    let pagesToOCR = Array<String>();
    if(!bookIndex && !bookAppendix && config.OCR) {
        const firstPages = await getPagesOCR(fileName, 1, config.TAKE_START_PAGES);
        const lastPages = await getPagesOCR(fileName, pages - config.TAKE_END_PAGES, pages);
        pagesToOCR = [...firstPages, ...lastPages];
    }
    
    return { rawText: bookIndex + bookAppendix, meta, pages, preview, pagesToOCR };        
}

const processPDF = async (fileName: string): Promise<ProcessResult> => {
    logger.debug(`Parsing pdf ${fileName}`);
    return parsePdf(fileName);
}

export default processPDF;