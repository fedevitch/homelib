import { env } from 'process';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

const scannerExecutablePath = `${__dirname.split('/homelib')[0]}/homelib/homelib-scanner/build/index.js`;

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
        io.emit('processing-file', processingFile[1])
      }
      const parsedProgress = /...%/.exec(data)
      if(parsedProgress){
        const progress = parsedProgress[0].replaceAll(/\(| |%|\)/g, '');
        io.emit('progress-update', Number.parseInt(progress) / 100);
      }
      const error = data.split('[ERROR] Library Scanner -')
      if(error[1]){
        io.emit('scanning-error', error[1])
      }
    })
    scannerProcess.stdout.on('close', () => {
      console.log('Scanning complete');
      io.emit('scanner-stop')
    })
  }

  const scannerStop = io => {
    io.emit('status-update', 'Stopped')
    env.scannerLaunched = '0'
  }
}



export {
  socketInit
}