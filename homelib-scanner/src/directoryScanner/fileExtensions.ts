export class FileExtensions {
    public static Formats = {
        pdf: "pdf",
        djvu: "djvu",
        djv: "djv",
        fb2: "fb2",
        epub: "epub"
    }

    public static getFormat = (fileName: string): string|null => {
        for (const format in this.Formats){
            const isThisFormat = new RegExp(`\.${format}$`).test(fileName);
            if(isThisFormat) return format;
        }
        return null;
    }

    public static getPureName = (fileName: string): string => fileName.substring(0, fileName.lastIndexOf('.'))
}