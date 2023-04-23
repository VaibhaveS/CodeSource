const { getDb } = require('../util/database');
var ObjectId = require('mongodb').ObjectId;
const mongoConnect = require('../util/database').getDb;

class Event {
  constructor(title, location, date, description) {
    this.title = title;
    this.date = date;
    this.location = location;
    this.description = description;
  }

  save() {
    const db = getDb();
    return db
      .collection('events')
      .insertOne(this)
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
      .collection('events')
      .find()
      .toArray()
      .then((events) => {
        return events;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(eventId) {
    const db = getDb();
    return db.collection('events').findOne({ _id: new ObjectId(eventId) });
  }

  static updateOrCreate(event) {
    const db = getDb();
    return db
      .collection('events')
      .updateOne(
        { _id: new ObjectId(event._id) },
        {
          $set: {
            title: event.title,
            location: event.location,
            date: event.date,
            description: event.description,
          },
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Event;
