const { getDb } = require('../util/database');

class Issue {
  constructor(issueId, details) {
    this.issueId = issueId;
    this.details = details;
  }

  save() {
    const db = getDb();
    return db
      .collection('issues')
      .countDocuments()
      .then(() => {
        return db.collection('issues').insertOne(this);
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
      .collection('issues')
      .find()
      .toArray()
      .then((issues) => {
        return issues;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(issueId) {
    const db = getDb();
    return db.collection('issues').findOne({ issueId: issueId });
  }

  static findByKey(key) {
    const db = getDb();
    return db.collection('issues').find({ key: key }).toArray();
  }

  static updateOrCreate(issueId, bookedBy, progress, due) {
    const db = getDb();
    return db
      .collection('issues')
      .updateOne(
        { issueId: issueId },
        {
          $set: {
            bookedBy: bookedBy,
            progress: progress,
            due: due,
          },
        },
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

module.exports = Issue;
