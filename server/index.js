const morgan = require('morgan');
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const axios = require('axios');
const app = express();
const ENV = require('../environment.config.js')
app.use(morgan('dev'));
//----------------------------------------- END OF IMPORTS---------------------------------------------------

app.use(express.static('public'));
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3001", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: ENV.SESS_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser(ENV.SESS_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.status(500).send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.cookie('user_id', user.user_id).status(200).send('successfully authenticated');
      });
    }
  })(req, res, next);
});
// app.post("/register", (req, res) => {
//find user in database
//if there is an error, throw err
//if a user is found, present message
//if no user found,
//hash the password they sent along
//save username and hashed password to database
app.post("/register", (req, res) => {
  let fieldToSearch = (req.body.username) ? {username: req.body.username} : {email: req.body.email};
  console.log('fts', fieldToSearch);
  axios({
    method: 'get',
    url: ENV.AUTH_ROUTE,
    data: fieldToSearch
  })
    .then(async (result) => {
      if (result.data) {
        res.status(501).send('That user already exists')
      } else {
        //create the new thing
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = {
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email
        };
        console.log('NEW USER', newUser);
        //send new user with hashed password to the database
        axios.post(ENV.USER_ROUTE, newUser)
          .then((result) => {
            res.cookie('user_id', result.data.user_id).status(201).send('Successfully Registered!');
          })
          .catch((err) => {
            console.log('create user error', err);
            res.status(500).send(err);
          })
      }
    })
    .catch((err) => {
      console.log('authUser failed', err)
      res.status(500).send('bad news');
    })
});
// });
app.get("/user", (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});
//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(4000, () => {
  console.log("Server Has Started");
});