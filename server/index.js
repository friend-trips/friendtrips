require('dotenv').config()
const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios');
const app = express();

const chatController = require('./controllers/chatController.js');

// const process.env = require('../configs/environment.config.js');
const session = require('express-session');

const authRoute = require('./routes/auth.js');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: false,
}))

app.use('*', (req, res, next) => {
  if (!req.isAuthenticated() && req.session.passport) {
    //if there is a passport session we can re-auth the user using the existing token
    console.log('reauthenticate this user')
  }
  next();
})

app.use('/auth', authRoute);
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


const http = require('http').createServer(app);
// const io = require('socket.io')(http, {
//   path: '/socket.io'
// });
const io = require('socket.io')(http);

//TODO: move this messageController stuff elsewhere and create a POST route (or socket event or something) to re-initialize the chatController with a new trip_id
let countOfConnections = 0;
let MessageController = require('./controllers/chatController.js');

let myMessageController = new MessageController();
myMessageController.initialize(1)
  .then((res) => {
    console.log('Message Controller Initialized')
  })
  .catch((err) => {
    console.log('Error Initializing Controller', err)
  })


io.use((socket, next) => {
  console.log('Connected socket.client ', socket.client.id, ' with authtoken ', socket.handshake.auth);
  next();
})
//on 'connection', io returns an object representing the client's socket
io.on('connection', (socket) => {
  countOfConnections++;
  io.emit('connectedUsers', countOfConnections)

  socket.on('greeting', () => {
    console.log('greeting', socket.id)
    let newMsg = {
      user_id: Number(socket.handshake.auth.user_id),
      username: socket.handshake.auth.username,
      trip_id: 1,
      type: 'info',
      message: 'joined the room'
    };
    // let feed = myMessageController.feed;
    // feed[Date.now()] = newMsg;
    // socket.emit('updatedMessages', feed)
    myMessageController.addToFeed(newMsg, 'message');
    io.emit('updatedMessages', myMessageController.feed);
    // io.emit('updatedMessages', feed)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
    countOfConnections--;
    io.emit('connectedUsers', countOfConnections);
    let newMsg = {
      user_id: Number(socket.handshake.auth.user_id),
      username: socket.handshake.auth.username,
      trip_id: 1,
      type: 'info',
      message: 'has left the room'
    }
    // let feed = myMessageController.feed;
    // feed[Date.now()] = newMsg;
    socket.disconnect();
    myMessageController.addToFeed(newMsg, 'message');
    io.emit('updatedMessages', myMessageController.feed);
    // }
  });

  //TODO: break out these AXIOS requests into controllers for each item -- return a promise so that we can emit our changes to the db back to the client from this file.
  socket.on('message', (text) => {
    let newMsg = {
      user_id: Number(socket.handshake.auth.user_id),
      trip_id: 1,
      message: text
    }
    axios.post('https://morning-bayou-59969.herokuapp.com/messages', newMsg)
      .then((result) => {
        console.log('successful message post to DB', result.data);
        newMsg.message_id = Number(result.data.message_id);
        newMsg.username = socket.handshake.auth.username;
        newMsg.type = 'message';
        newMsg.comments = [];
        myMessageController.addToFeed(newMsg, 'message');
        io.emit('updatedMessages', myMessageController.feed);
      })
      .catch((err) => {
        console.log('error in post to DB', err)
      })
  })

  socket.on('comment', (comment) => {
    console.log('Message', comment.message_id, 'received a comment: "', comment.comment, '"');
    let newComment = {
      trip_id: 1,
      message_id: comment.message_id,
      user_id: Number(socket.handshake.auth.user_id),
      comment: comment.comment
    }
    axios.post('https://morning-bayou-59969.herokuapp.com/comments', newComment)
      .then((result) => {
        console.log('successful comment post to DB', result.data);
        result.data.username = socket.handshake.auth.username;
        myMessageController.addToFeed(result.data, 'comment');
        io.emit('updatedMessages', myMessageController.feed);
      })
      .catch((err) => {
        console.log('error in post to DB', err)
      })
  })

  socket.on('addHotel', (hotel) => {
    axios({
      method: 'post',
      url: 'https://morning-bayou-59969.herokuapp.com/hotels',
      data: hotel,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((response) => {
        console.log('hotel from the client sent by the socket and saved in the database', response.data.rows[0])
        let newHotel = response.data.rows[0];
        newHotel.type = 'hotel';
        newHotel.timestamp = newHotel.time_created;
        newHotel.username = socket.handshake.auth.username;
        myMessageController.addToFeed(newHotel, 'hotel')
        io.emit('updatedHotels', response.data.rows[0])
        io.emit('updatedMessages', myMessageController.feed)
      })
      .catch(console.log)
  })

  socket.on('addFlight', (flight) => {
    axios({
      method: 'post',
      url: 'https://morning-bayou-59969.herokuapp.com/flights',
      data: flight,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((response) => {
        console.log('flight from the client sent by the socket and saved in the database', response.data)
        let newFlight = response.data;
        newFlight.type = 'flight';
        newFlight.timestamp = newFlight.meta.time_created;
        newFlight.username = socket.handshake.auth.username;
        myMessageController.addToFeed(newFlight, 'flight')
        io.emit('updatedFlights', response.data)
        io.emit('updatedMessages', myMessageController.feed)
      })
      .catch(console.log)
  });

  socket.on('addPOI', (poi) => {
    axios({
      method: 'post',
      url: 'https://morning-bayou-59969.herokuapp.com/pois',
      data: poi,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((response) => {
        console.log('poi from the client sent by the socket and saved in the database', response.data)
        let newPOI = response.data;
        // newPOI.type = 'poi';
        // newPOI.timestamp = newPOI.meta.time_created;
        // newPOI.username = socket.handshake.auth.username;
        // myMessageController.addToFeed(newPOI, 'poi')
        io.emit('updatedPOIs', response.data)
        // io.emit('updatedMessages', myMessageController.feed)
      })
      .catch(console.log)
  });

});



http.listen(process.env.PORT || 4000, () => {
  process.env.PORT ? console.log(`listening at http://localhost:${process.env.PORT}`) : console.log(`listening at 4000`);
});