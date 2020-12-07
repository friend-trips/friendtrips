const express = require('express');
const router = express.Router({ 'caseSensitive': true });
const cookieParser = require('cookie-parser');
const passport = require('passport');
// const session = require('express-session');
const bcrypt = require("bcrypt");
const axios = require('axios');
const ENV = require('../../configs/environment.config.js');
// router.use(
//   session({
//     secret: ENV.SESS_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
router.use(cookieParser(ENV.SESS_SECRET));
router.use(passport.initialize());
router.use(passport.session());
require("../passportConfig")(passport);

router.use('/', (req, res, next) => {
  console.log('inside auth', req.session, req.user)
  next();
})

router.post("/register", (req, res) => {
  let fieldToSearch = (req.body.username) ? {username: req.body.username} : {email: req.body.email};
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

router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    console.log('send user info back', req.user)
    res.status(200).send({user_id: req.user.user_id, username: req.user.username})
  } else {
    res.status(403).end()
  }
})
router.post('/login', (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.status(500).send("No User Exists");
    else {
      req.logIn(user, (err) => {
        console.log('logged in a user: ', user)
        if (err) throw err;
        res.cookie('user_id', user.user_id).cookie('username', user.username).status(200).send(user.username);
      });
    }
  })(req, res, next);
});
router.get('/logout', function(req, res){
  cookie = req.cookies;
  for (var prop in cookie) {
      if (!cookie.hasOwnProperty(prop)) {
          continue;
      }
      res.cookie(prop, '', {expires: new Date(0)});
      // console.log('PRE LOGOUT', req.session)
      //logOut removes the user from our passport session
      req.logOut();
      // console.log('POST LOGOUT / PRE DESTROY', req.session)
      // req.session.destroy((err) => {
      //   if (err) {
      //     console.log('well we tried but we could not destroy the session');
      //   } else {
      //     console.log('IT HAS BEEN DONE!', req.session);
      //   }
      // });
  }
  res.redirect('/');
});
module.exports = router;