var express = require('express');
var passport = require('passport');
const ejs = require('ejs');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var partials = require('express-partials');
var path = require('path');
const monogConnect = require('./util/database').mongoConnect;
const cors = require('cors');
const authRoute = require('./routes/auth');
const repoRoute = require('./routes/repo');
const eventRoute = require('./routes/events');
const dotenv = require('dotenv');
dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL;

var app = express();
app.engine('ejs', ejs.renderFile);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(
  cors({
    origin: CLIENT_URL,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoute);
app.use('/repo', repoRoute);
app.use('/events', eventRoute);

monogConnect(() => {
  app.listen(3000);
});
