import { StaticImageData } from 'next/image';
import { Formats } from './formats';
import homelib from '../../public/homelib.png';
import pdf from '../../public/pdf.png';
import djvu from '../../public/djvu.png';
import fb2 from '../../public/fb2.png';
import epub from '../../public/epub.png';
export default interface BookListItem {
    id: number;
    name: string;
    format: string;
    summary: string;
}

export const getFormatIcon = (format: string): StaticImageData => {
    switch(format){
        case Formats.fb2:
            return fb2;
        case Formats.djvu:
            return djvu;
        case Formats.pdf:
            return pdf;        
        default:
            return homelib;
    }

}