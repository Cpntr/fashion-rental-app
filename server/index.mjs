// server\index.mjs
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

const SLIDES_FILE = path.resolve('server/data/slides.json');

const ABOUT_FILE = path.resolve('server/data/aboutUs.json');

async function loadSlides() {
  const raw = await fs.readFile(SLIDES_FILE, 'utf8');
  return JSON.parse(raw);
}
async function saveSlides(slides) {
  await fs.writeFile(SLIDES_FILE, JSON.stringify(slides, null, 2), 'utf8');
}

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

// Slides routes
app.get('/api/slides', async (_, res) => {
  const slides = await loadSlides();
  res.json(slides);
});

app.get('/api/slides/:id', async (req, res) => {
  const slides = await loadSlides();
  const slide = slides.find((s) => s.id === Number(req.params.id));
  if (!slide) return res.status(404).json({ error: 'Not found' });
  res.json(slide);
});

app.post('/api/slides', async (req, res) => {
  const slides = await loadSlides();
  const nextId = slides.reduce((m, s) => Math.max(m, s.id), 0) + 1;
  const { image, title, subtitle } = req.body;
  if (!image || !title || !subtitle) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newSlide = { id: nextId, image, title, subtitle };
  slides.push(newSlide);
  await saveSlides(slides);
  res.status(201).json(newSlide);
});

app.put('/api/slides/:id', async (req, res) => {
  const slides = await loadSlides();
  const idx = slides.findIndex((s) => s.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { image, title, subtitle } = req.body;
  if (image !== undefined) slides[idx].image = image;
  if (title !== undefined) slides[idx].title = title;
  if (subtitle !== undefined) slides[idx].subtitle = subtitle;
  await saveSlides(slides);
  res.json(slides[idx]);
});

app.delete('/api/slides/:id', async (req, res) => {
  const slides = await loadSlides();
  const next = slides.filter((s) => s.id !== Number(req.params.id));
  if (next.length === slides.length) return res.status(404).json({ error: 'Not found' });
  await saveSlides(next);
  res.status(204).end();
});

async function loadAboutUs() {
  const raw = await fs.readFile(ABOUT_FILE, 'utf8');
  return JSON.parse(raw);
}
async function saveAboutUs(data) {
  await fs.writeFile(ABOUT_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// GET About Us
app.get('/api/about-us', async (_, res) => {
  try {
    const data = await loadAboutUs();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load About Us' });
  }
});

// UPDATE About Us
app.put('/api/about-us', async (req, res) => {
  try {
    await saveAboutUs(req.body);
    res.json(req.body);
  } catch (e) {
    res.status(500).json({ error: 'Failed to save About Us' });
  }
});
