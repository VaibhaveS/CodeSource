const { getDb } = require('../util/database');

const mongoConnect = require('../util/database').getDb;

class Data {
  constructor(userId, repoName, data) {
    this.key = userId + '#' + repoName;
    this.data = data;
  }

  save() {
    const db = getDb();
    return db
      .collection('data')
      .countDocuments()
      .then((count) => {
        this.RepoId = count + 1;
        return db.collection('data').insertOne(this);
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
      .collection('data')
      .find()
      .toArray()
      .then((data) => {
        console.log('returning', data);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findByKey(key) {
    const db = getDb();
    return db.collection('data').findOne({ key: key });
  }
}

module.exports = Data;
