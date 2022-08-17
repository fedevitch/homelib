// Generated by https://quicktype.io
// Generated by https://quicktype.io

export interface GoogleBookAPIResponse {
  kind:       string;
  totalItems: number;
  items:      Item[];
}

export interface Item {
  kind:       string;
  id:         string;
  etag:       string;
  selfLink:   string;
  volumeInfo: VolumeInfo;
  saleInfo:   SaleInfo;
  accessInfo: AccessInfo;
}

export interface AccessInfo {
  country:                string;
  viewability:            string;
  embeddable:             boolean;
  publicDomain:           boolean;
  textToSpeechPermission: string;
  epub:                   Epub;
  pdf:                    Epub;
  webReaderLink:          string;
  accessViewStatus:       string;
  quoteSharingAllowed:    boolean;
}

export interface Epub {
  isAvailable: boolean;
}

export interface SaleInfo {
  country:     string;
  saleability: string;
  isEbook:     boolean;
}

export interface VolumeInfo {
  title:               string;
  subtitle:            string;
  authors:             string[];
  publishedDate:       string;
  industryIdentifiers: IndustryIdentifier[];
  readingModes:        ReadingModes;
  pageCount:           number;
  printType:           string;
  maturityRating:      string;
  allowAnonLogging:    boolean;
  contentVersion:      string;
  language:            string;
  previewLink:         string;
  infoLink:            string;
  canonicalVolumeLink: string;
}

export interface IndustryIdentifier {
  type:       string;
  identifier: string;
}

export interface ReadingModes {
  text:  boolean;
  image: boolean;
}

export interface VolumeInfoParsed {
  id: number;
  bookId: number;
  title: String;
  authors: String;
  publisher: String;
  publishedDate: String;
  description: String;
  industryIdentifiers: Array<any>;
  pageCount: String
  categories: Array<String>;
  maturityRating: String
  language: String;
}

/*
https://www.googleapis.com/books/v1/volumes?q=978-966-2025-18-7
{
  "kind": "books#volumes",
  "totalItems": 0
}

https://www.googleapis.com/books/v1/volumes?q=5862252924
{
  "kind": "books#volumes",
  "totalItems": 1,
  "items": [
    {
      "kind": "books#volume",
      "id": "tbMWPAAACAAJ",
      "etag": "PaylZ8/jR+M",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/tbMWPAAACAAJ",
      "volumeInfo": {
        "title": "IBM PC для пользователя",
        "subtitle": "",
        "authors": [
          "Виктор Эвальдович Фигурнов"
        ],
        "publishedDate": "1997",
        "industryIdentifiers": [
          {
            "type": "ISBN_10",
            "identifier": "5862252924"
          },
          {
            "type": "ISBN_13",
            "identifier": "9785862252927"
          }
        ],
        "readingModes": {
          "text": false,
          "image": false
        },
        "pageCount": 640,
        "printType": "BOOK",
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": false,
        "contentVersion": "preview-1.0.0",
        "language": "ru",
        "previewLink": "http://books.google.com.ua/books?id=tbMWPAAACAAJ&dq=5862252924&hl=&cd=1&source=gbs_api",
        "infoLink": "http://books.google.com.ua/books?id=tbMWPAAACAAJ&dq=5862252924&hl=&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/IBM_PC_%D0%B4%D0%BB%D1%8F_%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F.html?hl=&id=tbMWPAAACAAJ"
      },
      "saleInfo": {
        "country": "UA",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "UA",
        "viewability": "NO_PAGES",
        "embeddable": false,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": false
        },
        "pdf": {
          "isAvailable": false
        },
        "webReaderLink": "http://play.google.com/books/reader?id=tbMWPAAACAAJ&hl=&printsec=frontcover&source=gbs_api",
        "accessViewStatus": "NONE",
        "quoteSharingAllowed": false
      }
    }
  ]
}

*/
