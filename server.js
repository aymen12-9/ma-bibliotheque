import jsonServer from 'json-server';
import WebSocket, { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom routes
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

server.use((req, res, next) => {
  res.on('finish', () => {
    const writeMethods = ['POST', 'PATCH', 'DELETE'];
    if (!writeMethods.includes(req.method)) return;
    if (!req.path.startsWith('/books') && !req.path.startsWith('/wishlist')) return;

    const data = router.db.getState();
    const message = JSON.stringify({ type: 'UPDATE', data });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  next();
});

server.use(router);

const httpServer = createServer(server);
const wss = new WebSocketServer({ server: httpServer });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('📱 Client connected to WebSocket');
  clients.add(ws);
  
  // Send initial data
  const initialData = router.db.getState();
  ws.send(JSON.stringify({ 
    type: 'INIT', 
    data: initialData 
  }));
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
  });
  
  ws.on('close', () => {
    console.log('📱 Client disconnected');
    clients.delete(ws);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 JSON Server with WebSocket running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server running on ws://localhost:${PORT}`);
});