const { getDb } = require('../util/database');

const mongoConnect = require('../util/database').getDb;

class Repo {
  constructor(userId, repoName, details) {
    this.key = userId + '#' + repoName;
    this.details = details;
    console.log('!!!!!!!');
    //console.log(type(details));
    console.log(details);
  }

  save() {
    const db = getDb();
    return db
      .collection('repos')
      .countDocuments()
      .then((count) => {
        console.log(this);
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

  static findAll() {
    const db = getDb();
    return db
      .collection('repos')
      .find()
      .toArray()
      .then((repos) => {
        console.log('returning', repos);
        return repos;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findByKey(key) {
    const db = getDb();
    return db.collection('repos').findOne({ key: key });
  }
  static insertNotion(fileDetails, repoKey, fileId) {
    const db = getDb();
    const repoDetails = db.collection('Notion').findOne({ key: repoKey });
    const fileData = db
      .collection('Notion')
      .findOne({ key: repoKey }, { fileId: { $exists: true } });
    if (repoDetails.size()) {
      db.collection('Notion').updateOne({ key: repoKey }, { $push: fileDetails });
    } else if (fileData.size()) {
      db.collection('Notion').updateOne({ key: repoKey }, { $set: { fileId: fileDetails } });
    } else {
      document['key'] = repoKey;
      document[fileId] = fileDetails;
      db.collection('Notion').insertOne(document);
    }
  }
  static findByfileId(repoKey, fileId) {
    // repoKey = userId + '#' + repoName
    /*
      repoKey:
      fileId:
        UID:
          HTML
          Tags
        UID :
          HTML
          Tags
    */
    const db = getDb();
    return db.collection('Notion').findOne({ key: repoKey }, { fileId: fileId }).toArray();
  }
}

module.exports = Repo;
