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

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.send(database.users);
  //  res.send('this is working');
  //   res.json(database.users);
  //console.log(database.users);
});

//sign in
app.post('/signin', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch((err) => {
      console.log('wrong credentials');
      res.status(400).json('wrong credentials');
    });
});

//register
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  // bcrypt.hash(password, saltRounds, function (err, hash) {
  //   // Store hash in your password DB.
  //   console.log(hash);
  // });
  const hash = bcrypt.hashSync(password, saltRounds);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .then(() => {
        return trx('users').insert({
          email: email,
          name: name,
          joined: new Date().toISOString().replace(/T/, '').replace(/\..+/, ''),
        });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
    .then(res.json('Register completed'))
    .catch((err) => res.status(400).json('unable to register '));

  // db.select('*')
  //   .from('users')
  //   .where({ email: email })
  //   .then((user) => {
  //     if (user) {
  //       res.json(user);
  //       console.log('am getting this');
  //     } else {
  //       res.status(404).json('Not Found');
  //     }
  //   })
  //   .catch((error) => {
  //     res.status(404).json('Error getting user');
  //   });
});

// Profile
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  // database.users.forEach((user) => {
  //   if (user.id === id) {
  //     res.status(200).json(user);
  //     found = true;
  //   }
  // });
  db.select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json('Not Found');
      }
    })
    .catch((error) => {
      res.status(404).json('Error getting user');
    });
});

//image
app.put('/image', (req, res) => {
  const { id } = req.body;
  // let found = false;
  // database.users.forEach((user) => {
  //   if (user.id === id) {
  //     user.entries++;
  //     res.status(200).json(user.entries);
  //     found = true;
  //   }
  // });
  // if (!found) {
  //   res.status(404).json('No such User');
  // }
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    // .then((entries) => {
    //   res.json(entries[0]);
    // })
    .catch((err) => res.status(400).json('unable to get entries'));

  db.select('entries')
    .from('users')
    .where({ id })
    .then((entries) => {
      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.status(404).json('Not Found');
      }
    })
    .catch((error) => {
      res.status(404).json('Error getting entries');
    });
});

app.listen(3001, () => {
  console.log('app is running  on port 3001');
});
