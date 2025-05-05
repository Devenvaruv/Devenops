const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@example.com' && password === '123456') {
    res.json({ message: 'Login successful' });
  } else {
    res.json({ message: 'Invalid credentials' });//
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});
