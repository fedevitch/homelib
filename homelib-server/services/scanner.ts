import { env } from 'process';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

const socketInit = (socket, io) => {
  socket.on('scanner-launch', () => {
    env.scannerLaunched = '1';
    scannerLaunch(io);
  })
  socket.on('scanner-stop', () => {
      env.scannerLaunched = '0';
      if(scannerProcess){
        scannerProcess.kill();
      }
      scannerStop(io);
  })

  let scannerProcess: ChildProcessWithoutNullStreams;

  const scannerLaunch = io => {
    io.emit('status-update', 'Launching scanner');
    
    scannerProcess = spawn('node', ['/home/lyubomyr/projects/homelib/homelib-scanner/build/index.js'])
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
    scannerProcess.stdout.on('data', out => {
      const data = out.toString()
      io.emit('status-update', data);
      const parsedProgress = /...%/.exec(data)
      if(parsedProgress){
        const progress = parsedProgress[0].replaceAll(/\(| |%|\)/g, '');
        console.log(progress)
        io.emit('progress-update', Number.parseInt(progress) / 100);
      }
    })
    scannerProcess.stdout.on('close', () => {
      console.log('Scanning complete');
      scannerStop(io);
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