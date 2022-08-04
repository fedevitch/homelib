enum ScannerEvents {
    Launch = 'scanner-launch',
    Stop = 'scanner-stop',
    Status = 'status-update',
    File = 'processing-file',
    Error = 'scanning-error',
    Progress = 'progress-update',
    OcrProgress = 'ocr-progress-update'
}

export default ScannerEvents