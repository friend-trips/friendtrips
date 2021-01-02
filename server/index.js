const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios');
const app = express();

const chatController = require('./controllers/chatController.js');

const ENV = require('../configs/environment.config.js');
const session = require('express-session');

const authRoute = require('./routes/auth.js');
// const chatRoute = require('./routes/chat.js');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
  secret: ENV.SESS_SECRET,
  resave: false,
  saveUninitialized: false,
}))

app.use('*', (req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  console.log(req.isAuthenticated())
  if (!req.isAuthenticated() && req.session.passport) {
    console.log('reauthenticate this user')
    // console.log('check cookies on unauthenticated request', req);
  }
  next();
})

app.use('/auth', authRoute);
//----------------------------------------- END OF ROUTES---------------------------------------------------
app.get('/login', (req, res) => {
  res.redirect('/')
})
app.get('/signup', (req, res) => {
  res.redirect('/')
})
app.get('/home', (req, res) => {
  res.redirect('/')
})
app.get("/user", (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});


/* Socket Auth Flow */
// app.use((req, res, next) => {
//   res.io = io;
//   next();
// })
const http = require('http').createServer(app);
// const io = require('socket.io')();
// io.attach(http)

const io = require('socket.io')(http, {
  path: '/socket.io'
});


let countOfConnections = 0;
let messages = [];
let flights = [];
let hotels = [];
let MessageController = require('./controllers/chatController.js');

let myMessageController = new MessageController();
myMessageController.initialize(1)
  .then((res)=>{
    console.log('Message Controller Initialized')
  })
  .catch((err)=>{
    console.log('Error Initializing Controller', err)
  })


// let comments = [];
//on 'connection', io returns an object representing the client's socket
io.use((socket, next) => {
  console.log('Connected socket.client ', socket.client.id, ' with authtoken ', socket.handshake.auth);
  next();
})
io.on('connection', (socket) => {
  countOfConnections++;
  io.emit('connectedUsers', countOfConnections)

  socket.on('greeting', () => {
    // console.log('greeting', socket.id)
    // let newMsg = {
    //   user_id: Number(socket.handshake.auth.user_id),
    //   username: socket.handshake.auth.username,
    //   trip_id: 1,
    //   type: 'message',
    //   message: 'joined the room'
    // };
    let feed = myMessageController.feed;
    // feed[Date.now()] = newMsg;
    socket.emit('updatedMessages', feed)
    // io.emit('updatedMessages', feed)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
    countOfConnections--;
    io.emit('connectedUsers', countOfConnections);
    // if (socket.handshake.auth.username) {
    //   let newMsg = {
    //     user_id: Number(socket.handshake.auth.user_id),
    //     username: socket.handshake.auth.username,
    //     trip_id: 1,
    //     message: 'has left the room'
    //   }
      let feed = myMessageController.feed;
      // feed[Date.now()] = newMsg;
      // io.emit('updatedMessages', feed);
      socket.disconnect();
    // }
  });

  socket.on('message', (text) => {
    let newMsg = {
      user_id: Number(socket.handshake.auth.user_id),
      trip_id: 1,
      message: text
    }
    // console.log(newMsg);
    axios.post('https://morning-bayou-59969.herokuapp.com/messages', newMsg)
      .then((result) => {
        console.log('successful message post to DB', result.data);
        newMsg.message_id = Number(result.data.message_id);
        newMsg.username = socket.handshake.auth.username;
        newMsg.type = 'message';
        newMsg.comments = [];
        myMessageController.addToFeed(newMsg, 'message');

        // messages = chatController.mergeFlights(messages, flights);
        // messages.push(newMsg);
        io.emit('updatedMessages', myMessageController.feed);
      })
      .catch((err) => {
        console.log('error in post to DB', err)
      })
  })

  socket.on('comment', (message, comment) => {
    console.log('Message', message.message_id ,'received a comment: "', comment, '"');
    let newComment = {
      trip_id: 1,
      message_id: message.message_id,
      user_id: Number(socket.handshake.auth.user_id),
      comment: comment
    }
    axios.post('https://morning-bayou-59969.herokuapp.com/comments', newComment)
      .then((result) => {
        console.log('successful comment post to DB', result.data);
        result.data.username = socket.handshake.auth.username;
        myMessageController.addToFeed(result.data, 'comment');
        io.emit('updatedMessages', myMessageController.feed);
        // io.emit('newCommentReceived', myMessageController.feed, result.data)
      })
      .catch((err) => {
        console.log('error in post to DB', err)
      })

  })
  // console.log(socket)
});

http.listen(4000, () => {
  console.log('listening at http://localhost:4000');
});