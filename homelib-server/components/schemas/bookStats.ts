export type BookStats = {
    all: number,
    byFormat:{
        pdf: number,
        djvu: number,
        fb2: number,
        doc: number,
        epub: number,
        comicBook: number,
        chm: number
    }
    
    bySize: {
        less1Mb: number, 
        normalSize: number, 
        mediumSize: number, 
        largeSize: number, 
        extraLargeSize: number
    }

    byPages:{
        small: number,
        medium: number,
        large: number
    }
}