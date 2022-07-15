import { StaticImageData } from 'next/image';
import { Formats } from './formats';
import homelib from '../../public/homelib.png';
import pdf from '../../public/pdf.png';
import djvu from '../../public/djvu.png';
import djv from '../../public/djv.png';
import fb2 from '../../public/fb2.png';
import epub from '../../public/epub.png';
import doc from '../../public/doc.png';
import docx from '../../public/docx.png';
import cbr from '../../public/cbr.png';
import rtf from '../../public/rtf.png';
export default interface BookListItem {
    id: number;
    name: string;
    format: string;
    summary: string;
}

const icons = { fb2, djv, djvu, doc, docx, pdf, rtf, cbr, epub };

export const getFormatIcon = (format: string): StaticImageData => {
    const validFormat = Formats[format] !== undefined;
    if(!validFormat) {
        return homelib;
    }
    return icons[format];
}