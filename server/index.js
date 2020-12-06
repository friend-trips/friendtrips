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
app.use(morgan('dev'));
const ENV = require('../environment.config.js');

//----------------------------------------- END OF IMPORTS---------------------------------------------------

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware
// app.use(
//   cors({
//     origin: "http://mydomain:3001", // <-- location of the react app were connecting to
//     credentials: true,
//     methods: ['GET', 'POST', 'OPTIONS']
//   })
// );
app.use(cors());
app.use(
  session({
    secret: ENV.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser(ENV.SESS_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------
// app.set('views', __dirname + '/views')
// app.engine('html', require('ejs').renderFile)
// app.set('view-engine', 'ejs')
// Routes
// app.get('/', (req, res) => {
//   res.render('index.ejs');
// })

// app.get('/home', (req, res) => {
//   console.log('sanity')
//   res.render('chatIndex.ejs')
// })

app.use((req, res, next)=>{
  console.log(req.session);
  console.log(req.user);
  console.log(req.isAuthenticated())
  next();
})

app.get('/home', (req, res) => {
  res.redirect('/')
})
app.get('/checkAuth', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send({user: req.session.passport.user})
  } else {
    res.status(403).end()
  }
})
app.post("/login", (req, res, next) => {
  console.log('IS IT AUTHED? ', req.isAuthenticated())
  passport.authenticate("local", (err, user, info) => {
    console.log('.authenticate done', err, user, info)
    if (err) throw err;
    if (!user) res.status(500).send("No User Exists");
    else {
      req.logIn(user, (err) => {
        console.log('loggged in a user: ', user)
        if (err) throw err;
        // res.cookie('user_id', user.user_id).render('chatIndex.ejs')
        res.cookie('user_id', user.user_id).status(200).send(user.username);
      });
    }
  })(req, res, next);
});
app.get('/logout', function(req, res){
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
      req.session.destroy((err) => {
        if (err) {
          console.log('well we tried but we could not destroy the session');
        } else {
          console.log('IT HAS BEEN DONE!', req.session);
        }
      });
  }
  res.redirect('/');
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