// Sqlite setup

// const handleProfileGet = (req, res, db) => {
//   const { id } = req.params;
//   db.select('*')
//     .from('users')
//     .where({ id })
//     .then((user) => {
//       if (user.length) {
//         res.json(user[0]);
//       } else {
//         res.status(404).json('Not Found');
//       }
//     })
//     .catch((error) => {
//       res.status(404).json('Error getting user');
//     });
// };

// This is Postgres
const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch((err) => res.status(400).json('error getting user'));
};

module.exports = {
  handleProfileGet,
};
