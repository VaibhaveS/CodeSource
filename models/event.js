const { getDb } = require('../util/database');
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
        console.log('returning', events);
        return events;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(eventId) {
    const db = getDb();
    return db
      .collection('events')
      .findOne({ _id: new mongoConnect.ObjectId(eventId) })
      .then((event) => {
        console.log('returning', event);
        return evnet;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Event;
