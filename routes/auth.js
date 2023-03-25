const router = require('express').Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv');
dotenv.config();
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
const User = require('../models/user');
const Token = require('../models/token');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(accessToken, refreshToken);
      // asynchronous verification, for effect...
      process.nextTick(function () {
        //create User if not present in DB
        User.findById(profile.id)
          .then((existingUser) => {
            if (!existingUser) {
              console.log('creating new user');
              const user = new User(profile.id, profile);
              user
                .save()
                .then((result) => {
                  console.log('New user saved to the database');
                })
                .catch((err) => {
                  console.error(err);
                  return done(err);
                });
            }
          })
          .catch((err) => {
            console.error(err);
            return done(err);
          });
        //update/create token for user
        Token.updateOrCreate(profile.id, accessToken, refreshToken)
          .then((token) => {
            console.log('created or updated token for user', profile.id);
          })
          .catch((err) => {
            console.error(err);
            return done(err);
          });
        //return user
        User.findById(profile.id).then((existingUser) => {
          if (existingUser) {
            return done(null, existingUser);
          }
          return done(null);
        });
      });
    }
  )
);

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this routerlication at /auth/github/callback
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  }
);

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    console.log(req.user);
    res.redirect(CLIENT_URL);
  }
);

router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'successfull',
      user: req.user,
    });
  }
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
