var express = require('express');
var passport = require('passport');
const ejs = require('ejs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const socketIO = require('socket.io');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var partials = require('express-partials');
var path = require('path');
const mongoConnect = require('./util/database').mongoConnect;
const cors = require('cors');
const authRoute = require('./routes/auth');
const repoRoute = require('./routes/repo');
const eventRoute = require('./routes/events');
const dotenv = require('dotenv');
const replyGPT = require('./util/gpt').replyGPT;
const CLIENT_URL = process.env.CLIENT_URL;
const io = socketIO();
dotenv.config();

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
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_CONNECT_URL,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res) => {
  res.redirect(CLIENT_URL);
});
app.use('/auth', authRoute);
app.use('/repo', repoRoute);
app.use('/events', eventRoute);

io.on('connection', (socket) => {
  socket.on('message', async (data) => {
    console.log(`Message received: ${data}`);

    const response = await replyGPT(data);

    console.log('emitting response', response);
    socket.emit('response', response);
  });
});

mongoConnect(() => {
  const server = app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
  io.attach(server);
});
