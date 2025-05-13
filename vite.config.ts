import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { networkInterfaces } from 'node:os';
import { ServerResponse } from 'node:http';

const getLocalIP = () => {
  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) results[name] = [];
        results[name].push(net.address);
      }
    }
  }

  // Priorizar direcciones comunes de LAN
  const priority = ['en0', 'eth0', 'wlan0'];
  for (const iface of priority) {
    if (results[iface]) return results[iface][0];
    
  }
  console.log(results.Ethernet)
  return results.Ethernet[0] || 'localhost';
};

const myPlugin = () => ({
  name: 'configure-server',
  configureServer(server) {
    server.middlewares.use('/api/ip', (req: Request, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ip: getLocalIP(), origin: req.headers}));
    });
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), myPlugin()],
  server: {
    host: '0.0.0.0',
    strictPort: true,
    port: 5173,
  },
})
