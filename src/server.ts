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
});
