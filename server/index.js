const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const port = 3128;

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.static('public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

//create Authentication router
const auth = express.Router();
//pass auth router to app server as middleware on /auth route
app.use('/auth', auth);

//auth middleware
auth.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'POST') {
    //verify user id and token
    //if things are good, next()
    //else status(500).end()
  }
  next();
})

app.get('/', (req, res) => {
  res.end();
});

app.post('/login', (req, res) => {
  console.log(req.body);
  //get hashed password of matching username
    //bcrypt.compare attemptedpassword with returned hashed password
  res.status(200).end();
})
app.post('/signup', (req, res) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, saltRounds)
    .then((hash) => {
      //store hashed password in database
      console.log('HASH', hash)
      res.cookie('authentiated', true)
      res.status(200).end();
    })
    .catch((err) => {
      res.status(400).end();
    });
})

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
