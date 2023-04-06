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
    let Id = 0;
    for (let component in dirTreeNested) {
      dirTreeNested[component]['directoryId'] = Id;
      Id += 1;
      if (component == 'files') {
        var newFiles = [];
        for (let i = 0; i < dirTreeNested[component].length; i++) {
          newFiles.push({ fileId: Id, fileName: dirTreeNested[component][i] });
          Id += 1;
        }
        dirTreeNested[component] = newFiles;
      } else {
        for (let subComp in dirTreeNested[component]) {
          if (subComp == 'files') {
            var newFiles = [];
            for (let i = 0; i < dirTreeNested[component][subComp].length; i++) {
              newFiles.push({ fileId: Id, fileName: dirTreeNested[component][subComp][i] });
              Id += 1;
            }
            dirTreeNested[component][subComp] = newFiles;
          }
        }
      }
    }
    return [dirTreeNested, body];
  }
}

router.post('/directoryTree', async function (req, res) {
  let repo = await Repo.findByKey(req.user.details.username + '#' + req.body.repoName);
  if (!repo) {
    repo = new Repo(req.user.details.username, req.body.repoName);
    const response = await getDirectoryTree(req);
    repo.details = {
      dirTree: response[0],
    };
    repo.meta = response[1];
    await repo.save();
  }
  return res.status(200).send(repo.details.dirTree);
});

router.get('/repos', async function (req, res) {
  let repos = await Repo.findAll();
  let repoDetails = [];
  for (repo of repos) {
    repoDetails.push(repo.meta);
  }
  return res.status(200).send(repoDetails);
});

module.exports = router;
