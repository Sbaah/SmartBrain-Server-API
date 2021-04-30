const handleRegister = (req, res, db, bcrypt, saltRounds) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
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
};

module.exports = {
  handleRegister,
};
