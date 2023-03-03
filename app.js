var express = require('express');
var passport = require('passport');
var util = require('util');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var GitHubStrategy = require('passport-github2').Strategy;
var partials = require('express-partials');
var path = require('path');
var https = require('https');


var GITHUB_CLIENT_ID = "816db5d84caf9ddd12b5";
var GITHUB_CLIENT_SECRET = "66d7f9aa5de76f921147f9878d3dfe6b0e903b15";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));




var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  console.log(req.user);
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/add-repo', function(req, res){
	res.render('addRepo', { user: req.user });
});

app.get('/myAccount', function(req, res){
	res.render('account', { user: req.user });
});


const httpGet = url => {
	//console.log(url);
	return new Promise((resolve, reject) => {
	  https.get(url, res => {
		res.setEncoding('utf8');
		let body = ''; 
		res.on('data', chunk => body += chunk);
		res.on('end', () => resolve(body));
	  }).on('error', reject);
	});
  };


  //TODO COMPLETE DIRECTORY SYNC
  app.post('/validateCollaborator', async function(req, res){
	console.log('/repos/'+ req.user.username + '/' + req.body.repoLink);
	const options = {
		hostname: 'api.github.com', 
		path: '/repos/'+ 'vaibhaveS' + '/' + req.body.repoLink,
		headers : {
            'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
		}
	}
	const body = JSON.parse(await httpGet(options));
	if(body.hasOwnProperty('message')){
		res.render('notValid', {user: req.user});
	}
	else {


		const optionsTwo = {
			hostname: 'api.github.com', 
			path: '/repos/'+ 'vaibhaveS' + '/' + req.body.repoLink + '/commits',
			headers : {
            	'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
			}
		}
		const bodyTwo = JSON.parse(await httpGet(optionsTwo));
		const url = bodyTwo[0].commit.tree.sha;
		
		const optionsThree = {
			hostname: 'api.github.com', 
			path: '/repos/'+ 'vaibhaveS' + '/' + req.body.repoLink + '/git/trees/' + url,
			headers : {
            	'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
			}
		}
		const bodyThree = JSON.parse(await httpGet(optionsThree));
		console.log(bodyThree);


		res.render('validateCollaborator', { user: req.user });
	}
});

app.get('/validateCollaborator', async function(req, res){
	//console.log('/repos/'+ req.user.username + '/' + req.body.repoLink);
	const options = {
		hostname: 'api.github.com', 
		path: '/repos/'+ 'vaibhaveS' + '/' + req.body.repoLink,
		headers : {
            'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
		}
	}
	const body = JSON.parse(await httpGet(options));
	if(body.hasOwnProperty('message-type')){
		console.log("fddd");

	}
	console.log(body);

	//res.render('validateCollaborator', { user: req.user });
});


// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
