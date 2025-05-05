const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- pretend catalog ---------------------------------------------=
const CATALOG = [
  { id: 1, title: 'The Legend of Zelda: Tears of the Kingdom' },
  { id: 2, title: 'God of War Ragnarök' },
  { id: 3, title: 'Hades' },
  { id: 4, title: 'Elden Ring' },
  { id: 5, title: 'Stardew Valley' }
];

// --- per‑user shelves ------------------------------------------------
const shelves = {};   

// Get full catalog
app.get('/games', (_req, res) => res.json(CATALOG));

// Add a game to a user shelf
app.post('/user/:email/games', (req, res) => {
  const { email }   = req.params;
  const { gameId }  = req.body;

  if (!CATALOG.find(g => g.id === gameId)) {
    return res.status(404).json({ message: 'Game not found' });
  }
  if (!shelves[email]) shelves[email] = new Set();
  shelves[email].add(gameId);

  res.json({ message: 'Added', shelf: [...shelves[email]] });
});

// Get a user’s shelf (resolved to full objects)
app.get('/user/:email/games', (req, res) => {
  const { email } = req.params;
  const ids       = shelves[email] ? [...shelves[email]] : [];
  const games     = CATALOG.filter(g => ids.includes(g.id));
  res.json(games);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Games service listening on ${PORT}`));
