import { networkInterfaces } from 'os';
import app from './app';

const getNetworkHost = () => {
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    const netInterface = nets[name];
    if (!netInterface) continue;

    for (const net of netInterface) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return '0.0.0.0';
};

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || getNetworkHost();

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  
  if (HOST !== 'localhost' && HOST !== '127.0.0.1') {
    console.log(`🚀 Server also accessible on http://localhost:${PORT}`);
  }
});

if (HOST !== 'localhost' && HOST !== '127.0.0.1' && HOST !== '0.0.0.0') {
  app.listen(PORT, 'localhost', () => {
    console.log(`🚀 Server also running on http://localhost:${PORT}`);
  });
}

if (HOST !== '0.0.0.0') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server also running on http://0.0.0.0:${PORT}`);
  });
}
