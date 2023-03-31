const { getDb } = require("../util/database");

const mongoConnect = require("../util/database").getDb;

class Event {
  constructor(details) {
    this.details = details;
    title = details.title;
    date = details.date;
    location = details.location;
    description = details.description;
  }

  save() {
    const db = getDb();
    return db
      .collection("events")
      .countDocuments()
      .then((count) => {
        this.EventId = count + 1;
        return db.collection("events").insertOne(this);
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
      .collection("events")
      .find()
      .toArray()
      .then((events) => {
        console.log("returning", events);
        return events;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Event;
