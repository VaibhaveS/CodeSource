const { getDb } = require('../util/database');

class Token {
  constructor(userId, accessToken, refreshToken) {
    this.userId = userId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  save() {
    const db = getDb();
    return db
      .collection('tokens')
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
    return db.collection('tokens').findOne({ userId: userId });
  }

  static updateOrCreate(userId, accessToken, refreshToken) {
    const db = getDb();
    return db
      .collection('tokens')
      .updateOne(
        { userId: userId },
        { $set: { accessToken: accessToken, refreshToken: refreshToken } },
        { upsert: true }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Token;
