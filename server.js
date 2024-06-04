const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Configurarea body-parser pentru a prelua datele din formulare
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurarea sesiunilor
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Pentru HTTPS, setează secure: true
}));

// Servirea fișierelor statice (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.redirect('pagina-pornire.html');
});

// Pagina principală
app.get('/pagina-pornire.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pagina-pornire.html'));
});

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ message: "Trebuie să fiți autentificat pentru a accesa această pagină." });
};

app.get('/valcea', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'valcea.html'));
});

app.get('/iasi', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'iasi.html'));
});

// Pagina de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Pagina de creare cont
app.get('/creare-cont', (req, res) => {
  res.sendFile(path.join(__dirname, 'creare-cont.html'));
});

// Endpoint pentru creare cont
let users = {}; // Ar trebui să fie înlocuit cu o bază de date reală
app.post('/creare-cont', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!users[username]) {
      users[username] = { password };
      res.redirect('/login');
    } else {
      res.send('User already exists');
    }
  } else {
    res.send('Username and password are required');
  }
});

// Endpoint pentru login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (users[username] && users[username].password === password) {
      req.session.user = username;
      console.log("User logged in:", req.session.user);
      res.redirect('/pagina-pornire.html');
    } else {
      res.send('Invalid username or password');
    }
  } else {
    res.send('Username and password are required');
  }
});

// Logout endpoint
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/pagina-pornire.html');
});

// Endpoint pentru verificarea autentificării
app.get('/isAuthenticated', (req, res) => {
  if (req.session.user) {
    res.status(200).send({ authenticated: true });
  } else {
    res.status(401).send({ authenticated: false });
  }
});

// Endpoint pentru procesarea formularului
app.get('/cale', (req, res) => {
  const { nume, prenume, tara, judet, nrtel, mail, recenzie, noutate } = req.query;
  console.log('Datele primite:', { nume, prenume, tara, judet, nrtel, mail, recenzie, noutate });
  res.send('Formular trimis cu succes');
});

// Middleware pentru pagină 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Pornirea serverului
app.listen(port, () => {
  console.log(`Serverul rulează la http://localhost:${port}`);
});