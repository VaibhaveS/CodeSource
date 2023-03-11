var express = require('express');
var passport = require('passport');
var util = require('util');
const ejs = require('ejs');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var GitHubStrategy = require('passport-github2').Strategy;
var partials = require('express-partials');
var path = require('path');
var https = require('https');
const { dir } = require('console');
const monogConnect = require('./util/database').mongoConnect;

var GITHUB_CLIENT_ID = "f47426e3d77c3da28b4e";
var GITHUB_CLIENT_SECRET = "5eff3f10b5d0fa4451151e4f8e7e8c729891fcff";

const User = require('./models/user');
const Event = require("./models/event");


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
	    // const user = new User(profile.id, profile);
	    // user.save().then(result => {
		// 	console.log("saved user");
	  	// })
		console.log("Heello");
		console.log(profile.id);
		

		User.findById({ userId: profile.id }).then(existingUser => {
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



	  //console.log("user pofile ", profile);
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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', ejs.renderFile);
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

app.get('/events', function(req, res) {
	Event.findAll().then(events => {
		const eventsObject = events.map(event => event.details);
		res.render('events', { user: req.user, events: eventsObject });
	})
});

app.get('/update-events', function(req, res) {
	Event.findAll().then(events => {
		const eventsObject = events.map(event => event.details);
		var selectedType = req.query.type;
		var filteredEvents = eventsObject.filter(function(event) {
			return selectedType == undefined || selectedType.toLowerCase() === 'all' || event.location.toLowerCase() === selectedType.toLowerCase();
		});
		console.log(filteredEvents, selectedType);
		res.render('updated_events', { user: req.user, events: filteredEvents });
	})
});



app.post('/add-events', function(req, res) {
	console.log("hai");
    const { title, date, location, description } = req.body;
    const event = new Event({ title, date, location, description });
    event.save().then(result => {
        console.log("added this event", result);
        res.redirect('/events');
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});

app.post('/events/add-events', function(req, res) {
	console.log("hai 2");
    const { title, date, location, description } = req.body;
    const event = new Event({ title, date, location, description });
    event.save().then(result => {
        console.log("added this event", result);
        res.redirect('/events');
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
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



  async function parseTree(repoName, sha_url) {
	const options = {
	  hostname: 'api.github.com',
	  path: '/repos/akash-1536/' + repoName + '/git/trees/' + sha_url,
	  headers: {
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
	  }
	};
	const response = JSON.parse(await httpGet(options));
	//console.log(repoName);
	//console.log(response);
	const files = {};
  
	for (let i = 0; i < response.tree.length; i++) {
	  const item = response.tree[i];
  
	  if (item.type === 'blob') {
		files[item.path] = item.sha;
	  } else if (item.type === 'tree') {
		const subFiles = await parseTree(repoName, item.sha);
		for (const subFile in subFiles) {
		  files[item.path + '/' + subFile] = subFiles[subFile];
		}
	  }
	}
  
	return files;
  }
  

  //TODO COMPLETE DIRECTORY SYNC
  app.post('/validateCollaborator', async function(req, res){
	console.log('/repos/'+ req.user.username + '/' + req.body.repoLink);
	const options = {
		hostname: 'api.github.com', 
		path: '/repos/'+ 'akash-1536' + '/' + req.body.repoLink,
		headers : {
            'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
		}
	}
	console.log(options);
	
	const body = JSON.parse(await httpGet(options));
	console.log(body);
	if(body.hasOwnProperty('message')){
		res.render('notValid', {user: req.user});
	}
	else {


		const optionsTwo = {
			hostname: 'api.github.com', 
			path: '/repos/'+ 'akash-1536' + '/' + req.body.repoLink + '/commits',
			headers : {
            	'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
			}
		}
		const bodyTwo = JSON.parse(await httpGet(optionsTwo));
		const url = bodyTwo[0].commit.tree.sha;
		
		// const optionsThree = {
		// 	hostname: 'api.github.com', 
		// 	path: '/repos/'+ 'akash-1536' + '/' + req.body.repoLink + '/git/trees/' + url,
		// 	headers : {
        //     	'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
		// 	}
		// }
		// const bodyThree = JSON.parse(await httpGet(optionsThree));
		//console.log(bodyThree);

		//const dirTree = await parseTree(req.body.repoLink, url);
		// const dirTree = {
		// 	'.eslintrc.json': 'bffb357a7122523ec94045523758c4b825b448ef',
  // '.gitignore': '299738afcc9356ef4df51f3241cd3a879a4184df',
  // 'README.md': 'edcae1ec9174d796fca5a640e642bb1d8d4affb7',
  // 'config.js': '1c54267f9fdf27c2bcd6496a1ca38cd1cfbf1196',
  // 'contracts/NFT.sol': '88f8076e14d20fd108983f4dd3a2735adf317710',
  // 'contracts/NFTMarket.sol': '28eef6f42fa01f878212b968cf17dff5f80bd912',
  // 'hardhat.config.js': '0b33a2b5cdcddd6af0e311d888362003fd63a55c',
  // 'next.config.js': '3e623abec1095592a29d602e43bc311c8f1eb379',
  // 'package-lock.json': 'fd04a97a05bebe386876f093ec0bf5c5beffce78',
  // 'package.json': 'e02202e880754462007bb27629244a119491b0d8',
  // 'pages/_app.js': 'a34df0e709711abbbcb19dee2e920372f4c1a939',
  // 'pages/api/hello.js': 'df63de88fa67cb006e692cc789caea580ba3697e',
  // 'pages/index.js': '52df765509d52c73d4657cadbde2821579872fb0',
  // 'pages/list-property.js': 'a3480615390565ca3e640f2f8af9bb43a6668046',
  // 'pages/my-property.js': 'b88d79c78cc29c8db6254ffe20ce206c21a57258',
  // 'pages/your-dashboard.js': '147908bd6cf22487ecc54a4f40c9e5f23d747c08',
  // 'postcss.config.js': '33ad091d26d8a9dc95ebdf616e217d985ec215b8',
  // 'public/favicon.ico': '718d6fea4835ec2d246af9800eddb7ffb276240c',
  // 'public/vercel.svg': 'fbf0e25a651c28931b2fe8afa2947e124eebc74f',
  // 'scripts/deploy.js': '80f069b557a2328f5843aef556592140463ac479',
  // 'styles/Home.module.css': '32a57d52f34c482d27411bec118da82ec7ff3edc',
  // 'styles/globals.css': '7a740f0186709dc05d30b8a2b00ad9124e36403d',
  // 'tailwind.config.js': 'bd6495961cb47601ce5880bfbb522fd032fc89a1',
  // 'test/sample-test.js': 'efda8a03919e97d9f44d63b273063204e4ec435f',
  // 'utils/NFTProperty.json': '45437a2b8180d72377dcfe1afbb45e4b26301e00',
  // 'utils/NFTPropertyMarket.json': '047db14e7dd4eb0ceee71586e60bf088d685fb11',
  // 'yarn.lock': '655ba2aa06052c42468f19944bb26a75d90a56ec'
		// }

		const dirTree = 
			{
			  '.gitignore': '549e00a2a96fa9d7c5dbc9859664a78d980158c2',
			  '.mvn/wrapper/maven-wrapper.jar': 'c1dd12f17644411d6e840bd5a10c6ecda0175f18',
			  '.mvn/wrapper/maven-wrapper.properties': 'b74bf7fcd640440a49eb602158547670ef907772',
			  'README.md': 'b0aa880afa59f9f8059396d981b415566f3f52eb',
			   'mvnw': '8a8fb2282df5b8f7263470a5a2dc0e196f35f35f',
			  'mvnw.cmd': '1d8ab018eaf11d9b3a4a90e7818ace373dfbb380',
			  'pom.xml': 'c0c1b00ab4521ff6ca0172b2213cefdfbbd65451',
			  'shardProp/SHARD1.properties': '202ed44016d28dc07a3516cd5afbc9418c992fa2',
			  'shardProp/SHARD2.properties': 'c7e9fc76073a328cfd18d2e1327415efd48d51e0',
			  'shardProp/SHARD3.properties': 'f0e2548261d4356c1adf055ab03e3061eb20af6f',
			  'src/main/java/com/example/done/DoneApplication.java': '38394a6d41da2782e0077849e73fc449eaf67e1d',
			  'src/main/java/com/example/done/batch/JobCompletionNotificationListener.java': '91a7e36017433f19d59eecb90466de76c382a26f',
			  'src/main/java/com/example/done/batch/SpringBatchConfig.java': '7088202f1fd97996c454b49590575b2abb3e79fa',
			  'src/main/java/com/example/done/batch/TodoProcessor.java': '04d6882972d28552bf95625e45031b6c2ee8d56e',
			  'src/main/java/com/example/done/controller/TodoController.java': '31f57f9e747a1af434e2128e42535f87996f7a62',
			  'src/main/java/com/example/done/model/TodoDTO.java': 'dbdd4927ffb36eded706aae26512f9a1ba3a6cd5',
			  'src/main/java/com/example/done/model/TodoItem.java': '821e6bee6836662bfb0cf7c4b51186f4bb4c7a14',
			  'src/main/java/com/example/done/queue/MessagingRabbitmqApplication.java': '0be92caa3d4b9bfc1bbc528f9eb1010c64943207',
			  'src/main/java/com/example/done/queue/Receiver.java': 'a5572d0a46e04c2e3a28491a5c78e5342f0a3d51',
			  'src/main/java/com/example/done/repo/TodoRepo.java': '45e0596401cc049c2db363ff74718a2da640fb69',
			  'src/main/java/com/example/done/service/TodoService.java': 'c758d9954a5cba67ab162858c536cdd3a2f596c3',
			  'src/main/java/com/example/done/shards/TodoContextHolder.java': 'ea012c8972d497c39ca9fc1a4871f84a06fe791c',
			  'src/main/java/com/example/done/shards/TodoDBConfig.java': '5dd1434c152ffd48fce8a8c0d0ece7530473db88',
			  'src/main/java/com/example/done/shards/TodoRoutingDataSource.java': 'b1473f0f16a219e57a1d1504959598693c67f22d',
			  'src/main/resources/application.properties': '05da2efdc7abb784f491beeb0c3863bda3375b75',
			  'src/main/resources/db.changelog/add-column-priority.xml': 'c733d1b5e3e893ab51cadcfdb2776aac3b0bb128',
			  'src/main/resources/db.changelog/changelog-master.xml': '7cd16ecd0890c8742028c8a78e8c818b360a1167',
			  'src/main/resources/db.changelog/create-table-todo.xml': '0900cc75a5cca9fee7267d4c623bfe0c9e24a8b1',
			  'src/main/resources/db.changelog/shard/add-column-context-key.xml': 'b6d0085c8217a5eef52f42e7d2dc1e4b80543e6a',
			  'src/main/resources/db.changelog/shard/changelog-master.xml': '345f61f87e29440a4628f9ede8aaf25600dc83ed',
			  'src/main/resources/db.changelog/shard/create-table-shard.xml': '6b2f3ff21f26a6b007151e5e584b3662c9910206',
			  'src/main/resources/todos.csv': '20cd2d7fe94ba2b69e7612cf5fef9fd475c30fef',
			  'src/test/java/com/example/done/cucumber/CucumberIntegrationTest.java': '8b1923eefa1f5cf3eaa2e6a4336ad43f99958fd6',
			  'src/test/java/com/example/done/cucumber/SpringIntegrationTest.java': '6cde3edf67fbe7aafa4df017bd0b6c72df835167',
			  'src/test/java/com/example/done/cucumber/glue/todoSteps.java': '10605dc8a0cfe7d65aab60d861300aa59f031c71',
			  'src/test/java/com/example/done/cucumber/todoConfig.java': 'd3511d42a31dd916959a524f5df16cd3c84fd6f6',
			  'src/test/resources/features/todoBatch.feature': '2d896393dfbd92d3202f92a513967492802c228c',
			  'src/test/resources/features/todoGet.feature': '12aab580d90e5aa3743ce89ff990e96c06ec9698',
			  'src/test/resources/features/todoPut.feature': '3761615e2387bfbb39e3d30bb193c8b670dfeb66'
			}
		console.log("directory structure")
  console.log(dirTree)
		
		res.render('repo', { files: dirTree });
	}
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


monogConnect(() => {
	app.listen(3000);
});



// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
