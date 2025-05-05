import React, { useState, useEffect } from 'react';
import './App.css';                 //  ← make sure this is imported

export default function App() {
  // ---------- auth state ---------------------------------------------
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [message,  setMessage]  = useState('');

  // ---------- data ----------------------------------------------------
  const [catalog, setCatalog] = useState([]);   // all games
  const [shelf,   setShelf]   = useState([]);   // user’s games

  // ---------- visual toggles -----------------------------------------
  const loggedIn = true;
  const [showAddPanel, setShowAddPanel] = useState(false);

  // ---------- helpers -------------------------------------------------
  const IMG = {
    1: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6l1v.png', // Zelda
    2: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s2v.png', // GoW
    3: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5v4g.png', // Hades
    4: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6auk.png', // Elden Ring
    5: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5wkh.png'  // Stardew
  };

  const handleLogin = async () => {
    const res  = await fetch('/api/login', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ email, password })
    });
    const data = await res.json();
    setMessage(data.message);

    if (data.message === 'Login successful') {
      await loadCatalog();
      await loadShelf();
    }
  };

  const loadCatalog = async () => {
    const games = await fetch('data/games').then(r => r.json());               // ← unchanged route
    setCatalog(games);
  };

  const loadShelf = async () => {
    const games = await fetch(`/data/user/${email}/games`).then(r => r.json()); // ← unchanged route
    setShelf(games);
  };

  const addGame = async (gameId) => {
    await fetch(`/data/user/${email}/games`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ gameId })
    });
    await loadShelf();           // refresh shelf after add
  };

  // close add panel when shelf updates
  useEffect(() => { setShowAddPanel(false); }, [shelf]);

  // -------------------------------------------------------------------
  return (
    <div className="app-frame">
      {/* ── MAIN HEADER ───────────────────────────────────── */}
      <header className="main-header">
        <h1 className="logo">GameBoxd</h1>

        <nav className="site-nav">
          <a href="#home">Home</a>
          <a href="#games">Games</a>
          <a href="#about">About</a>
        </nav>

        {loggedIn && <span className="username">{email}</span>}
      </header>

      {/* ── PLUS BUTTON (below header) ───────────────────── */}
      {loggedIn && (
        <div className="plus-bar">
          <button
            className="big-plus"
            title="Add a game"
            onClick={() => setShowAddPanel(!showAddPanel)}
          >
            ＋
          </button>
        </div>
      )}

      {/* ── LOGIN FORM ───────────────────────────────────── */}
      {!loggedIn && (
        <section className="login-box">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleLogin}>Sign In</button>
          <p className="msg">{message}</p>
        </section>
      )}

      {/* ── ADD‑GAME PANEL ───────────────────────────────── */}
      {showAddPanel && (
        <section className="catalog-grid" id="games">
          {catalog.map(g => {
            const owned = shelf.some(s => s.id === g.id);
            return (
              <div className="card" key={g.id}>
                <img src={IMG[g.id]} alt={g.title} />
                <div className="card-overlay">
                  <p>{g.title}</p>
                  <button
                    disabled={owned}
                    onClick={() => addGame(g.id)}
                  >
                    {owned ? 'Added' : 'Add'}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* ── USER SHELF ───────────────────────────────────── */}
      {loggedIn && shelf.length > 0 && (
        <section className="shelf-grid" id="home">
          {shelf.map(g => (
            <div className="card" key={g.id}>
              <img src={IMG[g.id]} alt={g.title} />
              <div className="card-overlay"><p>{g.title}</p></div>
            </div>
          ))}
        </section>
      )}

      {/* simple About anchor */}
      <footer id="about" className="about">
        <p>GameBoxd is a tiny demo clone of Letterboxd—just for video games.</p>
      </footer>
    </div>
  );
}
