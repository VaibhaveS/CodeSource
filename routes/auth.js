const router = require("express").Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv');
dotenv.config();
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
const User = require('../models/user');


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
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
		User.findById(profile.id).then(existingUser => {
			if (existingUser) {
				console.log('User already exists in the database');
			} else {
				console.log("creating new user");
				const user = new User(profile.id, profile);
				user.save().then(result => {
					console.log('New user saved to the database');
				}).catch(err => {
					console.error(err);
				});
			}}).catch(err => {
			console.error(err);
		});
      return done(null, profile);
    });
  }
));

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this routerlication at /auth/github/callback
router.get('/github',
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
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect(CLIENT_URL);
});

router.get('/login/success', (req, res) => {
	if (req.user) {
	  console.log("returning", req.user)
	  res.status(200).json({
		success: true,
		message: "successfull",
		user: req.user,
	  });
	}
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


module.exports = router;