import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.resolve('server/data/dresses.json');

async function loadDresses() {
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}
async function saveDresses(dresses) {
  await fs.writeFile(DATA_FILE, JSON.stringify(dresses, null, 2), 'utf8');
}

// GET all
app.get('/api/dresses', async (_, res) => {
  const dresses = await loadDresses();
  res.json(dresses);
});

// GET one
app.get('/api/dresses/:id', async (req, res) => {
  const dresses = await loadDresses();
  const dress = dresses.find((d) => d.id === Number(req.params.id));
  if (!dress) return res.status(404).json({ error: 'Not found' });
  res.json(dress);
});

// CREATE
app.post('/api/dresses', async (req, res) => {
  const dresses = await loadDresses();
  const nextId = dresses.reduce((m, d) => Math.max(m, d.id), 0) + 1;
  const images = Array.isArray(req.body.images)
    ? req.body.images
    : req.body.images
    ? [req.body.images]
    : [];
  const newDress = { ...req.body, id: nextId, images };
  dresses.push(newDress);
  await saveDresses(dresses);
  res.status(201).json(newDress);
});

// UPDATE
app.put('/api/dresses/:id', async (req, res) => {
  const dresses = await loadDresses();
  const idx = dresses.findIndex((d) => d.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const images = Array.isArray(req.body.images)
    ? req.body.images
    : typeof req.body.images === 'string'
    ? [req.body.images]
    : dresses[idx].images;
  dresses[idx] = { ...dresses[idx], ...req.body, images };
  await saveDresses(dresses);
  res.json(dresses[idx]);
});

// DELETE
app.delete('/api/dresses/:id', async (req, res) => {
  const dresses = await loadDresses();
  const next = dresses.filter((d) => d.id !== Number(req.params.id));
  if (next.length === dresses.length) return res.status(404).json({ error: 'Not found' });
  await saveDresses(next);
  res.status(204).end();
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`API ready at http://localhost:${PORT}`);
});
