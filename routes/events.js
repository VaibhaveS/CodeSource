const router = require('express').Router();
const https = require('https');
const Event = require('../models/event');

router.get('/events', function (req, res) {
  let events = [];
  Event.findAll().then((event) => {
    events.push(event);
  });
  return events;
});

//add-event
router.post('/addEvent', function (req, res) {
  const { title, location, date, description } = req.body;
  const newEvent = new Event(title, location, date, description);
  newEvent.save();
});

//update-event
router.post('/event', function (req, res) {
  const eventId = req.body.eventId; // ID is passed in the request body
  const { title, location, date, description } = req.body;
  Event.findById(eventId)
    .then((event) => {
      event.title = title;
      event.location = location;
      event.date = date;
      event.description = description;
      return event.save();
    })
    .then((updatedEvent) => {
      res.status(200).json(updatedEvent);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error updating event');
    });
});

module.exports = router;
