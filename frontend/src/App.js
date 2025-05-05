import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // --- game state ----------------------------------------------------
  const [catalog, setCatalog] = useState([]);   // all games
  const [shelf,   setShelf]   = useState([]);   // user’s games

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setMessage(data.message);

    if (data.message === 'Login successful') {
      await loadCatalog();
      await loadShelf();
    }

  };

  const loadCatalog = async () => {
    const games = await fetch('/games').then(r => r.json());
    setCatalog(games);
  };

  const loadShelf = async () => {
    const games = await fetch(`/games/user/${email}/games`).then(r => r.json());
    setShelf(games);
  };

  const addGame = async (gameId) => {
    await fetch(`/games/user/${email}/games`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ gameId })
    });
    await loadShelf();           // refresh shelf after add
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h1>GameBoxd 🕹</h1>

      {/* ---------- login section ------------------------------------ */}
      <section style={{ marginBottom: 20 }}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        /><br />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        /><br />
        <button onClick={handleLogin}>Login</button>
        <p>{message}</p>
      </section>

      {/* ---------- catalog ------------------------------------------ */}
      {catalog.length > 0 && (
        <section>
          <h2>Catalog</h2>
          <ul>
            {catalog.map(g => (
              <li key={g.id}>
                {g.title}
                <button
                  style={{ marginLeft: 8 }}
                  onClick={() => addGame(g.id)}
                  disabled={shelf.some(s => s.id === g.id)}
                >
                  {shelf.some(s => s.id === g.id) ? 'Added' : 'Add'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- user shelf --------------------------------------- */}
      {shelf.length > 0 && (
        <section>
          <h2>Your Shelf</h2>
          <ul>
            {shelf.map(g => <li key={g.id}>{g.title}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}

export default App;
