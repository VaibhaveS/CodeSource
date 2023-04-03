const router = require('express').Router();
const https = require('https');
const Token = require('../models/token');
const Repo = require('../models/repo');

const httpGet = (url, accessToken) => {
  const defaultHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36',
    Authorization: 'token ' + accessToken,
  };
  const options = {
    hostname: 'api.github.com',
    headers: defaultHeaders,
    path: url,
  };
  return new Promise((resolve, reject) => {
    https
      .get(options, (res) => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
};

async function getAccessToken(userId) {
  try {
    const token = await Token.findById(userId);
    return token.accessToken;
  } catch (err) {
    console.log('no token associated with this user::', userId);
    return null;
  }
}

async function parseTree(repoName, sha_url, userName, accessToken) {
  const response = JSON.parse(
    await httpGet('/repos/' + userName + '/' + repoName + '/git/trees/' + sha_url, accessToken)
  );
  const files = {};
  for (let i = 0; i < response.tree.length; i++) {
    const item = response.tree[i];
    if (item.type === 'blob') {
      files[item.path] = item.sha;
    } else if (item.type === 'tree') {
      const subFiles = await parseTree(repoName, item.sha, userName, accessToken);
      for (const subFile in subFiles) {
        files[item.path + '/' + subFile] = subFiles[subFile];
      }
    }
  }
  return files;
}

async function getDirectoryTree(req) {
  const accessToken = await getAccessToken(req.user.userId);
  const body = JSON.parse(
    await httpGet('/repos/' + req.user.details.username + '/' + req.body.repoName, accessToken)
  );
  if (body.hasOwnProperty('message')) {
    return null;
  } else {
    const bodyTwo = JSON.parse(
      await httpGet(
        '/repos/' + req.user.details.username + '/' + req.body.repoName + '/commits',
        accessToken
      )
    );
    const url = bodyTwo[0].commit.tree.sha;
    const dirTree = await parseTree(req.body.repoName, url, req.user.details.username, accessToken);
    let dirTreeNested = {};
    for (const filePath in dirTree) {
      const pathArray = filePath.split('/');
      let currentDict = dirTreeNested;
      //last one is a file name
      for (let i = 0; i < pathArray.length - 1; i++) {
        const pathSegment = pathArray[i];
        if (!currentDict.hasOwnProperty(pathSegment)) {
          currentDict[pathSegment] = {};
        }
        currentDict = currentDict[pathSegment];
      }
      if (!currentDict.hasOwnProperty('files')) {
        currentDict.files = [];
      }
      currentDict.files.push(pathArray[pathArray.length - 1]);
    }
    return dirTreeNested;
    //TO AVOID RATE LIMIT, RETURNING PRE-DEFINED STRUCTURE FOR DEBUGGING
    // return {
    //   '.gitignore': '549e00a2a96fa9d7c5dbc9859664a78d980158c2',
    //   'README.md': 'b0aa880afa59f9f8059396d981b415566f3f52eb',
    //   mvnw: '8a8fb2282df5b8f7263470a5a2dc0e196f35f35f',
    //   'pom.xml': 'c0c1b00ab4521ff6ca0172b2213cefdfbbd65451',
    //   'shardProp/SHARD1.properties': '202ed44016d28dc07a3516cd5afbc9418c992fa2',
    //   'src/main/java/com/example/done/DoneApplication.java':
    //     '38394a6d41da2782e0077849e73fc449eaf67e1d',
    //   'src/main/java/com/example/done/batch/JobCompletionNotificationListener.java':
    //     '91a7e36017433f19d59eecb90466de76c382a26f',
    //   'src/main/resources/application.properties': '05da2efdc7abb784f491beeb0c3863bda3375b75',
    //   'src/main/resources/db.changelog/add-column-priority.xml':
    //     'c733d1b5e3e893ab51cadcfdb2776aac3b0bb128',
    //   'src/main/resources/db.changelog/shard/add-column-context-key.xml':
    //     'b6d0085c8217a5eef52f42e7d2dc1e4b80543e6a',
    //   'src/main/resources/todos.csv': '20cd2d7fe94ba2b69e7612cf5fef9fd475c30fef',
    //   'src/test/resources/features/todoBatch.feature': '2d896393dfbd92d3202f92a513967492802c228c',
    // };
  }
}

router.post('/directoryTree', async function (req, res) {
  let repo = await Repo.findByKey(req.user.userId + '#' + req.body.repoName);
  if (!repo) {
    repo = new Repo(req.user.userId, req.body.repoName);
    repo.details = {
      dirTree: await getDirectoryTree(req),
    };
    await repo.save();
  }
  return res.status(200).send(repo.details.dirTree);
});

module.exports = router;
