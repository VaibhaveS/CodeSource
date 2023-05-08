const router = require('express').Router();
const https = require('https');
const Token = require('../models/token');
const Repo = require('../models/repo');
const Data = require('../models/data');
const Issue = require('../models/issue');

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

async function getContent(url, accessToken) {
  const response = JSON.parse(await httpGet(url, accessToken));
  return response.content;
}

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
      files[item.path] = {
        sha: item.sha,
        content: await getContent(item.url, accessToken),
      };
    } else if (item.type === 'tree') {
      const subFiles = await parseTree(repoName, item.sha, userName, accessToken);
      for (const subFile in subFiles) {
        files[item.path + '/' + subFile] = subFiles[subFile];
      }
    }
  }
  return files;
}

async function createIssues(req, username, reponame) {
  const accessToken = await getAccessToken(req.user.userId);
  const response = JSON.parse(
    await httpGet('/repos/' + username + '/' + reponame + '/issues', accessToken)
  );
  for (let issue of response) {
    let newIssue = new Issue(issue.id, issue);
    newIssue.key = username + '#' + reponame;
    newIssue.save();
  }
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
    const data = new Data(req.user.details.username, req.body.repoName, dirTree);
    await data.save();
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
    function assignIdsRecursively(node, id) {
      node.directoryId = id++;
      if (node.files) {
        for (let i = 0; i < node.files.length; i++) {
          const name = node.files[i];
          node.files[i] = {
            fileId: id++,
            filename: name,
          };
        }
      }
      for (let key in node) {
        if (typeof node[key] === 'object' && key !== 'files') {
          id = assignIdsRecursively(node[key], id);
        }
      }
      return id;
    }
    const root = {};
    root[req.body.repoName] = dirTreeNested;
    console.log(root);
    assignIdsRecursively(root, 0);
    return [root, body];
  }
}

router.post('/directoryTree', async function (req, res) {
  let repo = await Repo.findByKey(req.user.details.username + '#' + req.body.repoName);
  if (!repo) {
    repo = new Repo(req.user.details.username, req.body.repoName);
    createIssues(req, req.user.details.username, req.body.repoName);
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
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;

  const repos = await Repo.findAll(page, perPage);
  const repoDetails = repos.map((repo) => repo.meta);

  return res.status(200).send(repoDetails);
});

function getNameById(node, id, name) {
  if (node.directoryId === id) {
    return name;
  }
  if (node.files) {
    for (let file of node.files) {
      if (file.fileId === id) {
        return file.filename;
      }
    }
  }
  for (let key in node) {
    if (typeof node[key] === 'object' && key !== 'files') {
      const name = getNameById(node[key], id, key);
      if (name) {
        return name;
      }
    }
  }
  return null;
}

router.get('/:username/:reponame/name/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const username = req.params.username;
  const reponame = req.params.reponame;
  let repo = await Repo.findByKey(`${username}#${reponame}`);
  const name = getNameById(repo.details.dirTree, id, reponame);
  return res.status(200).send({ name });
});

router.get('/:username/:reponame', async function (req, res) {
  const username = req.params.username;
  const reponame = req.params.reponame;

  let repo = await Repo.findByKey(`${username}#${reponame}`);
  if (!repo) return res.status(404).send("repository doesn't exist");
  return res.status(200).send(repo);
});

router.get('/github-repos', async function (req, res) {
  const accessToken = await getAccessToken(req.user.userId);
  const response = JSON.parse(
    await httpGet('/users/' + req.user.details.username + '/' + 'repos', accessToken)
  );
  if (!response) return res.status(404).send("repository doesn't exist");
  for (repos of response) {
    const repo = await Repo.findByKey(req.user.details.username + '#' + repos.name);
    repos.is_codesource = false;
    if (repo) {
      repos.is_codesource = true;
    }
  }
  return res.status(200).send(response);
});

router.get('/:username/:reponame/issues', async function (req, res) {
  const username = req.params.username;
  const reponame = req.params.reponame;
  console.log(username, reponame);
  return res.status(200).send(await Issue.findByKey(username + '#' + reponame));
});

module.exports = router;
