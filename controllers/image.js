const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: '13920912349246e7ae556f6ae15692e7',
});

const handleApiCall = (req, res) => {
  app.models
    // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
    // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
    // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
    // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
    // is to use a different version of their model that works like: `c0c0ac362b03416da06ab3fa36fb58e3`
    // so you would change from:
    // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    // to:
    // .predict('c0c0ac362b03416da06ab3fa36fb58e3', req.body.input)
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json('unable to work with API'));
};

// // Sqlite setup
// const handleImage = (req, res, db) => {
//   const { id } = req.body;
//   db('users')
//     .where('id', '=', id)
//     .increment('entries', 1)
//     // .then((entries) => {
//     //   res.json(entries[0]);
//     // })
//     .catch((err) => res.status(400).json('unable to get entries'));

//   db.select('entries')
//     .from('users')
//     .where({ id })
//     .then((entries) => {
//       if (entries.length) {
//         res.json(entries[0]);
//       } else {
//         res.status(404).json('Not Found');
//       }
//     })
//     .catch((error) => {
//       res.status(404).json('Error getting entries');
//     });
// };

// This is Postgres
const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json('unable to get entries'));
};

module.exports = {
  handleApiCall,
  handleImage,
};
