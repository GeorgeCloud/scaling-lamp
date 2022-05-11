const jwt = require('jsonwebtoken');

module.exports = function (app, User) {
  app.get('/signin', async (req, res) => res.render('signin'));

  app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }, 'username password')
      .then((user) => {
        if (!user) {
          return res.status(401).send({ message: 'Wrong Username or Password' });
        }
        user.comparePassword(password, (err, isMatch) => {
          if (!isMatch) {
            console.log('Incorrect Username or password')
            return res.redirect('/signin')
          }
          const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
            expiresIn: '60 days',
          });
          res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
          return res.redirect('/');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get('/signup', async (req, res) => res.render('signup'));

  app.post('/signup', (req, res) => {
      const user = new User(req.body);

      user
        .save()
        .then(() => res.redirect('/signin'))
        .catch((err) => {
          console.log(err.message);
        });
    });

  app.get('/logout', async (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/signin')
  });
}
