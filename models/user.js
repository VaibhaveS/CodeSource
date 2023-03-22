const { getDb } = require('../util/database');

const mongoConnect = require('../util/database').getDb;

class User {
  constructor(userId, details) {
    this.userId = userId;
    this.details = details;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users').findOne({ userId: userId });
  }
}

module.exports = User;
