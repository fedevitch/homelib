import { env } from 'process';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import ScannerEvents from '../components/schemas/scannerEvents';

const scannerExecutablePath = `${__dirname.split('homelib')[0]}/homelib/homelib-scanner/build/index.js`;

const socketInit = (socket, io) => {
  socket.on('scanner-launch', () => {
    env.scannerLaunched = '1';
    scannerLaunch(io);
  })
  socket.on('scanner-stop', () => {
      if(scannerProcess){
        scannerProcess.kill();
      }
      scannerStop(io);
  })

  let scannerProcess: ChildProcessWithoutNullStreams;

  const scannerLaunch = io => {
    io.emit('status-update', 'Launching scanner');
    
    scannerProcess = spawn('node', [scannerExecutablePath])
    scannerProcess.on('error', err => {
      console.log('error')
      console.error(err)
    })
    scannerProcess.stderr.on('data', err => {
      console.log('stderr data')
      console.error(err)
      console.error(err.toString())
    })
    scannerProcess.stderr.on('error', err => {
      console.log('sderr error')
      console.error(err)
    })
    scannerProcess.on('data', console.log);
    scannerProcess.stdout.on('data', out => {
      const data = out.toString()
      console.log(data)
      //io.emit('status-update', data);      
      const processingFile = data.split('scanning file: ')
      if(processingFile[1]){
        io.emit(ScannerEvents.File, processingFile[1])
      }
      const parsedProgress = /...%/.exec(data)
      if(parsedProgress){
        const progress = parsedProgress[0].replaceAll(/\(| |%|\)/g, '');
        io.emit(ScannerEvents.Progress, Number.parseInt(progress) / 100);
      }
      const error = data.split('[ERROR] Library Scanner -')
      if(error[1]){
        io.emit(ScannerEvents.Error, error[1])
      }
      const ocrProgress = data.split('Recognizing: ')
      if(ocrProgress[1]){
        io.emit(ScannerEvents.Status, 'Recognizing page')
        io.emit(ScannerEvents.OcrProgress, ocrProgress[1])
      }
    })
    scannerProcess.stdout.on('close', () => {
      io.emit(ScannerEvents.Stop)
    })
  }

  const scannerStop = io => {
    io.emit(ScannerEvents.Status, 'Stopped')
    env.scannerLaunched = '0'
  }
}



export {
  socketInit
}