const sanitizeRegExp = new RegExp("\\n|\\t|�|", "gm");

export const sanitize = (text: string | String) => {
    if(!text) return '';
    return text.replaceAll(sanitizeRegExp, '');
}

interface SizeData {
    value: String;
    measure: String;
}

export const fileSize = (size: number): SizeData => {
    if(!size) return { value: "0", measure: "bytes" };
    if(size >= Math.pow(1024, 3) && size < Math.pow(1024, 4)){
        return { value: (size / Math.pow(1024, 3)).toFixed(2), measure: "Gb" }        
    }
    if(size >= Math.pow(1024, 2) && size < Math.pow(1024, 3)){
        return { value: (size / Math.pow(1024, 2)).toFixed(2), measure: "Mb" }        
    }
    if(size >= 1024 && size < Math.pow(1024, 2)){
        return { value: (size / 1024).toFixed(2), measure: "Kb" };
    }
    return { value: size.toString(), measure: "bytes" };
}