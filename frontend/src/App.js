import React, { useState } from 'react';

/* ------------- helper: simple poster lookup ---------------------- */
const poster = (title) =>
  // quick & dirty: “https://picsum.photos/seed/<slug>/120/180”
  `https://picsum.photos/seed/${encodeURIComponent(title)}/120/180`;

function App() {
  /* --------------------- auth state ---------------------------- */
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [message,   setMessage]   = useState('');
  const [loggedIn,  setLoggedIn]  = useState(false);

  /* --------------------- game state -------------------------------- */
  const [catalog, setCatalog] = useState([]);  // all games
  const [shelf,   setShelf]   = useState([]);  // user’s games

  /* --------------------- auth flow -------------------------------- */
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
      setLoggedIn(true);
    }
  };

  /* --------------------- data fetches ----------------------------- */
  const loadCatalog = async () => {
    const games = await fetch('data/games').then(r => r.json());
    setCatalog(games);
  };

  const loadShelf = async () => {
    const games = await fetch(`/data/user/${email}/games`).then(r => r.json());
    setShelf(games);
  };

  const addGame = async (gameId) => {
    await fetch(`/data/user/${email}/games`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ gameId })
    });
    await loadShelf();
  };

  /* --------------------- UI bits ---------------------------------- */
  const isOnShelf = (id) => shelf.some(g => g.id === id);
  const userName  = email.split('@')[0] || 'Guest';

  /* --------------------- render ----------------------------------- */
  if (!loggedIn) {
    return (
      <div className="login‑page">
        <h1>GameBoxd 🕹</h1>
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
        <button onClick={handleLogin}>Log In</button>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* ---------------- header ---------------- */}
      <header className="header">
        <h2>GameBoxd</h2>
        <nav>
          <a href="#home">Home</a>
          <a href="#games">Games</a>
          <a href="#about">About</a>
        </nav>
        <span className="user">{userName}</span>
      </header>

      {/* ---------------- catalog ---------------- */}
      <section>
        <h3>Catalog</h3>
        <div className="grid">
          {catalog.map(g => (
            <div key={g.id} className="card">
              <img src={poster(g.title)} alt={g.title} />
              {!isOnShelf(g.id) ? (
                <button className="add" onClick={() => addGame(g.id)}>+</button>
              ) : (
                <span className="added">✓</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- shelf ---------------- */}
      {shelf.length > 0 && (
        <section>
          <h3>Your Shelf</h3>
          <div className="grid">
            {shelf.map(g => (
              <div key={g.id} className="card">
                <img src={poster(g.title)} alt={g.title} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;

/* ------------- quick styles (could move to CSS file) --------------- */
const style = document.createElement('style');
style.textContent = `
  body { margin:0; font-family:system-ui; background:#1c1d1f; color:#e6e6e6; }
  .login‑page, .app { max-width:900px; margin:40px auto; padding:0 16px; text-align:center; }
  input { padding:8px; margin:6px 0; width:240px; }
  button { padding:8px 14px; margin-top:6px; cursor:pointer; }
  header.header { display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; }
  header h2 { margin:0; }
  header nav a { margin:0 10px; color:#9c9c9c; text-decoration:none; }
  .user { font-weight:bold; }
  h3 { margin:24px 0 12px; }
  .grid { display:grid; gap:14px; grid-template-columns:repeat(auto-fill,120px); justify-content:center; }
  .card { position:relative; }
  .card img { width:120px; height:180px; object-fit:cover; border-radius:4px; }
  .card button.add,
  .card span.added { position:absolute; bottom:6px; right:6px; width:28px; height:28px;
                     border-radius:50%; border:none; font-size:18px; line-height:28px;
                     text-align:center; cursor:pointer; color:#fff; background:#2ecc71; }
  .card button.add { background:#3498db; }
`;
document.head.appendChild(style);
