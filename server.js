const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
// const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { response } = require('express');
const saltRounds = 13;
const myPlaintextPassword = 's0//P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const smartBrainDB = './sqlite_db/smartBrain.db';

// control for the cruds
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  // Enter your own database information here based on what you created
  client: 'sqlite3',
  connection: {
    filename: smartBrainDB,
  },
  useNullAsDefault: true,
});

const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(db.users);
});
//  res.send('this is working');
//   res.json(database.users);
//console.log(database.users);

// //sign in
app.post('/signin', signin.handleSignin(db, bcrypt));

//register
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt, saltRounds);
});

// Profile
app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});

//image
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(3001, () => {
  console.log('app is running  on port 3001');
});
