const router = require("express").Router();
const https = require("https");

router.get("/events", function (req, res) {
  Event.findAll().then((events) => {
    //details attribute in event.js created to map here
    const eventsObject = events.map((event) => event.details);
  });
});

router.get("/update-events", function (req, res) {
  Event.findAll().then((events) => {
    const eventsObject = events.map((event) => event.details);
    //to do - take object from front-end and store in db
    var selectedType = req.query.type;
    var filteredEvents = eventsObject.filter(function (event) {
      return (
        selectedType == undefined ||
        selectedType.toLowerCase() === "all" ||
        event.location.toLowerCase() === selectedType.toLowerCase()
      );
    });
    console.log(filteredEvents, selectedType);
  });
});

router.post("/add-events", function (req, res) {
  const details = req.body;
  const event = new Event(details);
  event
    .save()
    .then((result) => {
      console.log("added this event", result);
      res.redirect("/events");
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.post("/events/add-events", function (req, res) {
  const details = req.body;
  const event = new Event(details);
  event
    .save()
    .then((result) => {
      console.log("added this event", result);
      res.redirect("/events");
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
