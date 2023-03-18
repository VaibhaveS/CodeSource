const router = require("express").Router();
const https = require("https");

const httpGet = url => {
    console.log(url);
	return new Promise((resolve, reject) => {
	  https.get(url, res => {
		res.setEncoding('utf8');
		let body = ''; 
		res.on('data', chunk => body += chunk);
		res.on('end', () => resolve(body));
	  }).on('error', reject);
	});
};

async function parseTree(repoName, sha_url, userName) {
	const options = {
	  hostname: 'api.github.com',
	  path: '/repos/' + userName + '/' + repoName + '/git/trees/' + sha_url,
	  headers: {
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
	  }
	};
	const response = JSON.parse(await httpGet(options));
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
  
router.post('/directoryTree', async function(req, res){
    //TO AVOID RATE LIMIT, RETURNING PRE-DEFINED STRUCTURE FOR DEBUGGING
    return res.status(200).send({
        '.gitignore': '549e00a2a96fa9d7c5dbc9859664a78d980158c2',
        'README.md': 'b0aa880afa59f9f8059396d981b415566f3f52eb',
        'mvnw': '8a8fb2282df5b8f7263470a5a2dc0e196f35f35f',
        'pom.xml': 'c0c1b00ab4521ff6ca0172b2213cefdfbbd65451',
        'shardProp/SHARD1.properties': '202ed44016d28dc07a3516cd5afbc9418c992fa2',
        'src/main/java/com/example/done/DoneApplication.java': '38394a6d41da2782e0077849e73fc449eaf67e1d',
        'src/main/java/com/example/done/batch/JobCompletionNotificationListener.java': '91a7e36017433f19d59eecb90466de76c382a26f',
        'src/main/resources/application.properties': '05da2efdc7abb784f491beeb0c3863bda3375b75',
        'src/main/resources/db.changelog/add-column-priority.xml': 'c733d1b5e3e893ab51cadcfdb2776aac3b0bb128',
        'src/main/resources/db.changelog/shard/add-column-context-key.xml': 'b6d0085c8217a5eef52f42e7d2dc1e4b80543e6a',
        'src/main/resources/todos.csv': '20cd2d7fe94ba2b69e7612cf5fef9fd475c30fef',
        'src/test/resources/features/todoBatch.feature': '2d896393dfbd92d3202f92a513967492802c228c',
    });
	const options = {
		hostname: 'api.github.com', 
		path: '/repos/'+ req.user.username + '/' + req.body.repoLink,
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
			path: '/repos/'+ req.user.username + '/' + req.body.repoLink + '/commits',
			headers : {
            	'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
			}
		}
		const bodyTwo = JSON.parse(await httpGet(optionsTwo));
		const url = bodyTwo[0].commit.tree.sha;
		const dirTree = await parseTree(req.body.repoLink, url, req.user.username);
		let dirTreeNested = {};
		for (const filePath in dirTree) {
			const pathArray = filePath.split('/');
			let currentDict = dirTreeNested;
			//last one is a file name
			for (let i = 0; i < pathArray.length-1; i++) {
				const pathSegment = pathArray[i];
				if (!currentDict.hasOwnProperty(pathSegment)) {
				  currentDict[pathSegment] = {};
				}
				currentDict = currentDict[pathSegment];
			}
			if (!currentDict.hasOwnProperty('files')) {
				currentDict.files = [];
			}
			currentDict.files.push(pathArray[pathArray.length-1]);
		}
		return res.status(200).send(dirTreeNested);
	} 
}); 

module.exports = router;