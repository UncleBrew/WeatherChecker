import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
import express from 'express';
// TODO: Define route to serve index.html
const app = express();
app.get('/routes', (_req, res) => res.sendFile(path.join(__dirname, '../client/index.html')));
export default router;
