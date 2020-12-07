const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const axios = require('axios');
const ENV = require('../configs/environment.config.js')

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      console.log('begin verification')
      //grab matching user record from the database
      axios({
        method: 'get',
        url: ENV.AUTH_ROUTE,
        data: {
          username: username
        }
      })
        .then((result) => {
          if (!result.data) {
            //if theres no data, we couldn't find a matching user in the database -- return false in the place of our user
            return done(null, false);
          } else {
            //if we found a matching record, use bcrypt to find compare the hashed passwords
            bcrypt.compare(password, result.data.password, (err, passwordCompareResult) => {
              //if the compare fails with an error, throw it
              if (err) throw err;
              if (passwordCompareResult === true) {
                //user provided the correct password
                // delete result.data.password;
                // delete result.data.email;
                return done(null, result.data);
              } else {
                //user provided an incorrect password
                return done(null, false);
              }
            });
          }
        })
        .catch((err) => {
          //if we got an error while searching for a user in the database, return false as user
          console.log('error looking up user in database', err);
          done(null, false);
        });
    })
  );
  //serializeUser takes a userID, serializes it into a token and attaches it to the session -- deserialize takes that information off of the browsers session and verifies it, returning the users info if valid.
  passport.serializeUser((user, cb) => {
    cb(null, user.user_id);
  });
  passport.deserializeUser((id, cb) => {
    console.log('DESERIALIZE')
    axios.get(`${ENV.USER_ROUTE + '/' + id}`)
      .then((req) => {
        console.log('DS', req.data)
        const userInformation = {
          username: req.data[0].username,
          user_id: req.data[0].user_id
        };
        cb(null, userInformation);
      })
      .catch((err) => {
        cb(err);
      })
  });
}