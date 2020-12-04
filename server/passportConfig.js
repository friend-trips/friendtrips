const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const axios = require('axios');
const ENV = require('../environment.config.js')

module.exports = function (passport) {

  passport.use(
    new localStrategy((username, password, done) => {
      //find a user in the database
      //if err throw err, if none exists return done(null,false) to signify no user found
      //else a user is found
      //bcrypt compare password with actual password
      //if err throw err, if check fails return done(null, false)
      //if valid user, done(null, user);
      axios({
        method: 'get',
        url: ENV.AUTH_ROUTE,
        data: {
          username: username
        }
      })
        .then((result) => {
          if (!result.data) {
            return done(null, false);
          } else {
            bcrypt.compare(password, result.data.password, (err, passwordCompareResult) => {
              if (err) throw err;
              if (passwordCompareResult === true) {
                return done(null, result.data);
              } else {
                return done(null, false);
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // User.findOne({ username: username }, (err, user) => {
      //   if (err) throw err;
      //   if (!user) return done(null, false);
      //   bcrypt.compare(password, user.password, (err, result) => {
      //     if (err) throw err;
      //     if (result === true) {
      //       return done(null, user);
      //     } else {
      //       return done(null, false);
      //     }
      //   });
      // });
    })
  );
  //serializeUser takes a userID, serializes it into a token and attaches it to the session -- deserialize takes that information off of the browsers session and verifies it, returning the users info if valid.
  passport.serializeUser((user, cb) => {
    cb(null, user.user_id);
  });
  passport.deserializeUser((id, cb) => {
    axios.get(`${ENV.USER_ROUTE + '/' + id}`)
      .then((result) => {
        const userInformation = {
          username: result[0].username,
          user_id: result[0].user_id
        };
        cb(err, userInformation);
      })
    // User.findOne({ _id: id }, (err, user) => {
    //   const userInformation = {
    //     username: user.username,
    //   };
    //   cb(err, userInformation);
    // });
  });
}