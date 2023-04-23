const router = require('express').Router();
const https = require('https');
var ObjectId = require('mongodb').ObjectId;
const Event = require('../models/event');
const { type } = require('express/lib/response');

router.get('/events', async function (req, res) {
  let events = [];
  await Event.findAll().then((event) => {
    events.push(event);
  });
  return res.status(200).json(events);
});

router.post('/addEvent', function (req, res) {
  const { title, location, date, description } = req.body;
  const newEvent = new Event(title, location, date, description);
  newEvent.save();
  return res.status(200).json(newEvent);
});

router.post('/event', function (req, res) {
  const eventId = req.body.eventId;
  const { title, location, date, description } = req.body;
  Event.findById(eventId)
    .then((event) => {
      if (!event) {
        throw new Error('Event not found');
      }
      event.title = title;
      Event.updateOrCreate(event);
    })
    .then((result) => {
      console.log(result);
      res.statusCode(200).json(result);
    })
    .catch((err) => {
      res.statusCode(500).json(err);
    });
});

module.exports = router;
