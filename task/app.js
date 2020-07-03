const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// Set Public Folder
app.use(express.static(path.join(__dirname, "public")));




app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Route Files
let bms = require("./routes/bms");
let movies = require("./routes/movies");
let events = require("./routes/events");
let users = require("./routes/users");

app.get("/", (req, res) => {
  res.send('<a href="/bms" > Click here</a>', );
});
app.use("/bms", bms);
app.use("/movies", movies);
app.use("/events", events);
app.use("/users", users);

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening of port ${port}`);
});
