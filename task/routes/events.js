const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
// const db = require("../db");
const { get } = require("./movies");
const dbService = require("../dbService");
const { func } = require("@hapi/joi");
const db = dbService.getDbServiceInstance();

// Events
// const events = [
//   {id:1, name:"EVENT 1",theatre:"	INOX SRMT MALL - 1"},
//   {id:2, name:"EVENT 2",theatre:"	INOX SRMT MALL - 2"},
//   {id:3, name:"EVENT 3",theatre:"	INOX SRMT MALL - 3"},
//   {id:4, name:"EVENT 4",theatre:"	INOX SRMT MALL - 4"},
//   {id:5, name:"EVENT 5",theatre:"	INOX SRMT MALL - 5"},
//   {id:6, name:"EVENT 6",theatre:"	INOX SRMT MALL - 6"},
//   {id:7, name:"EVENT 7",theatre:"	INOX SRMT MALL - 7"},
//   {id:8, name:"EVENT 8",theatre:"	INOX SRMT MALL - 8"},
//   {id:9, name:"EVENT 9",theatre:"	INOX SRMT MALL - 9"}

// ]

// GET operation or read
router.get("/", (req, res) => {
  const result = db.getAllEventsData();
  // res.send("Hello world!!!!!");
  // res.render('list_movies',{title:"BMS", items:movies});
  result
    .then((data) =>
      res.render("events/card_events", { title: "Events list", events: data })
    )
    .catch((err) => console.log(err));
});
// Add Route
router.get("/add", function (req, res) {
  res.render("events/add_event", {
    title: "Add Event",
  });
});

// Edit Route
router.get("/edit/:id", (req, res) => {
  const result = db.searchByEventId(parseInt(req.params.id));

  result
    .then(function (val) {
      res.render("events/edit_event", {
        title: "Edit Event",
        id: req.params.id,
        event: val,
      });
    })
    .catch((err) => console.log(err));
});

// Delet Route
router.get("/delete/:id", (req, res) => {
  const result = db.searchByEventId(parseInt(req.params.id));
  result
    .then(function (val) {
      res.render("events/delete_event", {
        title: "Delete event",
        event: val,
      });
    })
    .catch((err) => console.log(err));
});

router.get("/register", (req, res) => {
  let result = db.getAllEventsData();
  result
    .then(function (val) {
      res.render("bms/card_events", { title: "Event list", events: val });
    })
    .catch((err) => console.log(err));
});
router.get("/register/:id", (req, res) => {
  const result = db.searchByEventId(parseInt(req.params.id));
  result
    .then(function (val) {
      res.render("bms/event_register", { event: val, id: req.params.id });
    })
    .catch((err) => console.log(err));
});
// Add Submit POST Route
router.post("/add", (req, res) => {
  const event = {
    name: req.body.title,
    theatre: req.body.theatre,
    showdate: req.body.showdate,
    showtime: req.body.showtime,
  };
  const result = db.insertNewEvent(event);
  result
    .then(function (val) {
      res.render("events/message", { event: val, message: "Added" });
    })
    .catch((err) => console.log(err));

  // events.push(event);
});

// Load Edit Form
router.post("/edit/:id", (req, res) => {
  const event = {
    id: req.params.id,
    name: req.body.title,
    theatre: req.body.theatre,
    showdate: req.body.showdate,
    showtime: req.body.showtime,
  };
  const result = db.updateEventById(event);
  result
    .then(function (val) {
      res.render("events/message", { event: val, message: "updated" });
    })
    .catch((err) => console.log(err));
});

// Delete Article
router.post("/delete/:id", (req, res) => {
  // check the existence
  const result = db.deleteRowEventById(parseInt(req.params.id));
  result
    .then(function (val) {
      res.render("events/message", { event: val, message: "deleted" });
    })
    .catch((err) => console.log(err));
});

// post register event
router.post("/register/:id", (req, res) => {
  const result = db.searchByEventId(parseInt(req.params.id));
  result
    .then(function (val) {
      var total = parseInt(req.body.fair) * parseInt(req.body.tickets);
      res.render("bms/event_preview_register", {
        event: val,
        fair: req.body.fair,
        tickets: req.body.tickets,
        total: total,
      });
    })
    .catch((err) => console.log(err));
});
// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/users/login");
  }
}

// validation
function validationEvent(event) {
  const schema = Joi.object({
    title: Joi.string().min(2).required(),
    theatre: Joi.string().min(2).required(),
  });
  return schema.validate(event);
}

module.exports = router;
