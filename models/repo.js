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
}

module.exports = Repo;
