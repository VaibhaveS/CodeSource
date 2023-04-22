const { getDb } = require('../util/database');

const mongoConnect = require('../util/database').getDb;

class Repo {
  constructor(userName, repoName, details) {
    this.name = repoName;
    this.key = userName + '#' + repoName;
    this.details = details;
  }

  save() {
    const db = getDb();
    return db
      .collection('repos')
      .countDocuments()
      .then((count) => {
        this.RepoId = count + 1;
        return db.collection('repos').insertOne(this);
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findAll(page, perPage) {
    const db = getDb();
    const skips = perPage * (page - 1);
    return db
      .collection('repos')
      .find()
      .skip(skips)
      .limit(perPage)
      .toArray()
      .then((repos) => {
        console.log('returning', repos);
        return repos;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async insertNotion(fileDetails, repoKey, fileId) {
    const db = getDb();
    const repoDetails = await db.collection('Notion').findOne({ key: repoKey });
    var fileIdExists = false;
    if (repoDetails) {
      var repofiles = repoDetails['repoFiles'];
      console.log(repofiles);
      console.log(repofiles.length);
      for (const [key, value] of Object.entries(repofiles)) {
        for (var i in value) {
          var currFileId = Number(i);
          console.log(typeof currFileId);
          console.log(currFileId);
          console.log(key);
          if (currFileId == fileId) {
            fileIdExists = true;
            repofiles[key][currFileId] = fileDetails;
            db.collection('Notion').updateOne({ key: repoKey }, { $set: { repoFiles: repofiles } });
            break;
          }
        }
        if (fileIdExists) break;
      }
    }
    if (repoDetails && !fileIdExists) {
      var fileDict = {};
      fileDict[fileId] = fileDetails;
      db.collection('Notion').updateOne({ key: repoKey }, { $push: { repoFiles: fileDict } });
    } else if (!fileIdExists) {
      var document = {};
      document['key'] = repoKey;
      var repofiles = [];
      var fileDict = {};
      fileDict[fileId] = fileDetails;
      repofiles.push(fileDict);
      document['repoFiles'] = repofiles;
      db.collection('Notion').insertOne(document);
      //}
    }
  }
  static async findByfileId(repoKey, fileId) {
    // repoKey = userId + '#' + repoName
    /*
      repoKey:
        repoFiles = [
          (fileId:
              [UID
              HTML
              Tags,
              UID 
              HTML
              Tags]
            ),
        ]
    */
    const db = getDb();
    const repoDetails = await db.collection('Notion').findOne({ key: repoKey });
    var fileIdExists = false;
    if (repoDetails) {
      var repofiles = repoDetails['repoFiles'];
      for (const [key, value] of Object.entries(repofiles)) {
        for (var i in value) {
          var currFileId = Number(i);
          if (currFileId == fileId) {
            fileIdExists = true;
            console.log(repofiles[key][currFileId]);
            return repofiles[key][currFileId];
            break;
          }
        }
      }
      return {};
    }
  }

  static findByKey(key) {
    const db = getDb();
    return db.collection('repos').findOne({ key: key });
  }
}

module.exports = Repo;
