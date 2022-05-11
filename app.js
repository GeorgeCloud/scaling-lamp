const express        = require('express');
const Handlebars     = require('handlebars')
const exphbs         = require('express-handlebars');
const methodOverride = require('method-override')
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const session        = require('express-session');
const jwt            = require('jsonwebtoken');
const Post           = require('./models/post');
const Comment        = require('./models/comment');
const User           = require('./models/user');
const checkAuth = require('./middleware/checkAuth');

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
// const { body, validationResult } = require('express-validator');

require('dotenv').config()
require('./data/foody-db');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(cookieParser(process.env.SESSION_SECRET))

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', 'handlebars');
app.set("views", "./views");
app.use(checkAuth);
app.use(express.static('public'));
const path = require('path')
// app.use(express.static(path.join(__dirname, 'public')))

Handlebars.registerHelper('concat', (str1, str2, separator) => {
 return `${str1 || ''}${separator || ''}${str2 || ''}`;
});

app.get('/', async (req, res) => {
  const currentUser = req.user;

  try {
    const posts = await Post.find({});
    return res.render('home', { posts, currentUser });
  } catch (err) {
    console.log(err.message);
  }
});

app.post('/search', async (req, res) => {
  const category = req.body.category;

  res.redirect(`/r/${category}`);
});

app.get('/r/:category', async (req, res) => {
  const { user } = req;
  const category = req.params.category

  Post.find({ category: category }).lean()
    .then((posts) => res.render('category', { posts, user }))
    .catch((err) => {
      console.log(err);
    });
});

require('./controllers/auth')(app, User)
require('./controllers/users')(app, User, Post)
require('./controllers/posts')(app, Post, Comment)


app.listen(port, () => {
  console.log(`App listening on port ${port}}!`)
})

module.exports = app
