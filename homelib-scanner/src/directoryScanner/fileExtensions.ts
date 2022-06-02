export class FileExtensions {
    public static Formats = {
        pdf: "pdf",
        djvu: "djvu",
        fb2: "fb2"
    }

    public static getFormat = (fileName: string): string|null => {
        for (const format in this.Formats){
            const isThisFormat = new RegExp(`\.${format}$`).test(fileName);
            if(isThisFormat) return format;
        }
        return null;
    }
}