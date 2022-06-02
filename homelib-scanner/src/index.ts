import scanDirectories from './directoryScanner';
import scanFile from './fileScanner';

console.log('starting scanner...');
const start = async () => {

    const fileList = await scanDirectories('../');

    for await (const file of fileList) {
        const fileInfo = await scanFile(file);
        console.log(fileInfo.entry.getFullName());
    }

}

start();