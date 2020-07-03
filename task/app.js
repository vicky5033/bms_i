const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const config = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();
// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

// Set Public Folder
app.use(express.static(path.join(__dirname, "public")));

// Express Session Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
app.use(expressValidator());

// Passport Config
require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

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
  res.send('<a href="/users/register" > Click here</a>', );
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
