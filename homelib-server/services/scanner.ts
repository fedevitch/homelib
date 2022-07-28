

const scannerLaunch = io => {
  io.emit('status-update', 'launcher init');
  setInterval(() => publishProgress(io), 5000);
}

const publishProgress = io => {
  console.log('publishing progress');
  io.emit('progress-update', Math.random());
}

export {
  scannerLaunch, publishProgress
}