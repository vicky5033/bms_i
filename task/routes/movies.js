const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");

const dbService = require("../dbService");
const db = dbService.getDbServiceInstance();

// GET operation or read
router.get("/", (req, res) => {
  let result = db.getAllMoviesData();
  result
    .then(function (val) {
      res.render("movies/card_movies", { title: "Movie list", movies: val });
    })
    .catch((err) => console.log(err));
});
// Add Route
router.get("/add", function (req, res) {
  res.render("movies/add_movie", {
    title: "Add Movie",
  });
});

// Edit Route
router.get("/edit/:id", (req, res) => {
  let result = db.searchByMoiveId(parseInt(req.params.id));
  result
    .then(function (val) {
      res.render("movies/edit_movie", {
        title: "Edit Movie",
        movie: val,
        id: req.params.id,
      });
    })
    .catch((err) => console.log(err));
});

// Delet Route
router.get("/delete/:id", (req, res) => {
  const result = db.searchByMoiveId(parseInt(req.params.id));

  result
    .then(function (val) {
      res.render("movies/delete_movie", {
        title: "delete Movie",
        movie: val,
        id: req.params.id,
      });
    })
    .catch((err) => console.log(err));
});

// get forms
router.get("/forms", function (req, res) {
  res.render("movies/tab_forms", {
    title: "Add Movie",
  });
});

router.get("/register", (req, res) => {
  let result = db.getAllMoviesData();
  result
    .then(function (val) {
      res.render("bms/card_movies", { title: "Movie list", movies: val });
    })
    .catch((err) => console.log(err));
});
router.get("/register/:id", (req, res) => {
  const result = db.searchByMoiveId(parseInt(req.params.id));
  result
    .then(function (val) {
      res.render("bms/movie_register", { movie: val, id: req.params.id });
    })
    .catch((err) => console.log(err));
});

// Add Submit POST Route
router.post("/add", (req, res) => {
  const movie = {
    name: req.body.title,
    theatre: req.body.theatre,
    showdate: req.body.showdate,
    showtime: req.body.showtime,
  };

  // movies.push(movie);
  const result = db.insertNewMovie(movie);

  result
    .then((data) =>
      res.render("movies/message", { movie: data, message: "Added" })
    )
    .catch((err) => console.log(err));
});

// Load Edit Form
router.post("/edit/:id", (req, res) => {
  const movie = {
    id: req.params.id,
    name: req.body.title,
    theatre: req.body.theatre,
    showdate: req.body.showdate,
    showtime: req.body.showtime,
  };
  console.log(movie);
  const result = db.updateMovieById(movie);
  result
    .then((data) =>
      res.render("movies/message", { movie: movie, message: "updated" })
    )
    .catch((err) => console.log(err));
});

// Delete Article
router.post("/delete/:id", (req, res) => {
  // check the existence
  const result = db.deleteRowMovieById(req.params.id);
  // get the index
  // const index = movies.indexOf(movie);
  // delete
  result
    .then(function (val) {
      res.render("movies/message", { message: "deleted" });
    })
    .catch((err) => console.log(err));
  // movies.splice(index, 1);
});

// post register movie
router.post("/register/:id", (req, res) => {
  const result = db.searchByMoiveId(parseInt(req.params.id));
  console.log(req.params.id);

  result
    .then(function (val) {
      console.log(val);
      var total = parseInt(req.body.fair) * parseInt(req.body.tickets);

      res.render("bms/movie_preview_register", {
        movie: val,
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
function validationMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(2).required(),
    theatre: Joi.string().min(2).required(),
  });
  return schema.validate(movie);
}

module.exports = router;
