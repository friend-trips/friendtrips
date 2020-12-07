const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios');
const app = express();

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
  console.log(req.session, req.user);
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
const io = require('socket.io')(http, {
  path: '/socket.io'
});

// app.get('/chat', chatRoute(io));

// app.listen(4000, () => {
//   console.log('Friendtrips is running on http://localhost:4000')
// })

/* End Socket Auth Flow */

let countOfConnections = 0;
let messages = [];
let flights = [];
let hotels = [];
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
    console.log('greeting', socket.id)
    if (messages.length === 0) {
      if (flights.length === 0) {
        axios.get(`https://morning-bayou-59969.herokuapp.com/flights/?trip_id=${2}`)
          .then((result) => {
            flights = Object.values(result.data);
            // console.log('FLIGHTS', flights)
          })
          .catch((err) => {
            console.log(err, 'couldnt get flights')
          })
      }
      console.log('Fetching new messages')
      axios({
        method: 'get',
        url: `https://morning-bayou-59969.herokuapp.com/messages/?trip_id=${1}`
      })
        .then((messageQueryResult) => {
          let listOfMessages = messageQueryResult.data;
          if (messages.length === 0) {
            let messageMap = {}
            for (let i = 0; i <= listOfMessages.length - 1; i++) {
              if (!messageMap[listOfMessages[i].message_id]) {
                let msgToReturn = listOfMessages[i];
                msgToReturn.comments = [];
                messageMap[listOfMessages[i].message_id] = msgToReturn
              }
            }
            axios({
              method: 'get',
              url: `https://morning-bayou-59969.herokuapp.com/comments/?trip_id=${1}`
            })
              .then((commentQueryResult) => {
                let comments = commentQueryResult.data
                for (let i = 0; i <= comments.length - 1; i++) {
                  if (messageMap[comments[i].message_id]) {
                    messageMap[comments[i].message_id].comments.push(comments[i]);
                  }
                }
                let newMsg = {
                  user_id: Number(socket.handshake.auth.user_id),
                  username: socket.handshake.auth.username,
                  trip_id: 1,
                  type: 'message',
                  message: 'joined the room'
                }

                messages = Object.values(messageMap);
                // console.log('send messages if no flights', flights)
                if (flights.length > 0) {
                  let copyOfFlights = flights.slice().sort((a, b) => {
                    return (Number(a.meta.time_created) - Number(b.meta.time_created))
                  });
                  let copyOfMessages = messages.slice().sort((a, b) => {
                    return (Number(a.timestamp) - Number(b.timestamp))
                  });
                  let flightsPointer = 0;
                  let messagesPointer = 0;
                  let results = []
                  let obj = {}
                  while (flightsPointer < copyOfFlights.length && messagesPointer < copyOfMessages.length) {
                    // console.log(copyOfFlights[flightsPointer].meta.time_created, copyOfMessages[messagesPointer].timestamp)
                    // console.log(flightsPointer, messagesPointer)
                    if (copyOfFlights[flightsPointer].meta.time_created < copyOfMessages[messagesPointer].timestamp) {
                      let currentFlight = copyOfFlights[flightsPointer];
                      currentFlight.type = 'flight'
                      results.push(currentFlight)
                      flightsPointer++;
                    } else {
                      let currentMessage = copyOfMessages[messagesPointer];
                      currentMessage.type = 'message'
                      results.push(currentMessage)
                      messagesPointer++;
                    }
                  }
                  for (let i = messagesPointer; i <= copyOfMessages.length - 1; i++) {
                    let currentMessage = copyOfMessages[messagesPointer];
                    currentMessage.type = 'message'
                    results.push(copyOfMessages[i])
                  }
                  for (let i = flightsPointer; i <= copyOfFlights.length - 1; i++) {
                    let currentFlight = copyOfFlights[flightsPointer];
                    currentFlight.type = 'flight'
                    results.push(copyOfFlights[i])

                  }
                  messages = results;
                  messages.push(newMsg);
                }
                // console.log('sending', messages.slice(messages.length - 5), 'messages');
                io.emit('updatedMessages', messages);
              })
              .catch((commentQueryErr) => {
                console.log('couldnt handle teh comments', commentQueryErr)
              })
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (socket.handshake.auth.username) {
        let newMsg = {
          user_id: Number(socket.handshake.auth.user_id),
          username: socket.handshake.auth.username,
          trip_id: 1,
          message: 'joined the room'
        }
        messages.push(newMsg);
        io.emit('updatedMessages', messages);
      }
    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
    countOfConnections--;
    io.emit('connectedUsers', countOfConnections);
    if (socket.handshake.auth.username) {
      let newMsg = {
        user_id: Number(socket.handshake.auth.user_id),
        username: socket.handshake.auth.username,
        trip_id: 1,
        message: 'has left the room'
      }
      messages.push(newMsg);
      io.emit('updatedMessages', messages);
      socket.disconnect();
    }
  });

  socket.on('message', (text) => {
    let newMsg = {
      user_id: Number(socket.handshake.auth.user_id),
      trip_id: 1,
      message: text
    }
    console.log(newMsg);
    axios.post('https://morning-bayou-59969.herokuapp.com/messages', newMsg)
      .then((result) => {
        console.log('successful message post to DB', result.data);
        newMsg.id = Number(result.data.message_id);
        newMsg.username = socket.handshake.auth.username;
        newMsg.type = 'message';
        messages.push(newMsg);
        io.emit('updatedMessages', messages);
      })
      .catch((err) => {
        console.log('error in post to DB', err)
      })
  })

  socket.on('comment', (message, comment) => {
    let newComment = {
      message_id: message.message_id,
      user_id: Number(socket.handshake.auth.user_id),
      comment: comment
    }
    axios.post('https://morning-bayou-59969.herokuapp.com/comments', newComment)
      .then((result) => {
        console.log('successful message post to DB', result.data);
        newComment.id = result.data.message_id;
        // messages.push(newComment);
        if (messages[message.message_id]) {
          if (Array.isArray(messages[message.message_id].comments)) {
            messages[message.message_id].comments.push(newComment)
          } else {
            messages[message.message_id].comments = [newComment]
          }
        }
      })
      .catch((err) => {
        console.log('error in post to DB', err)
      })
    io.emit('updatedMessages', messages);
  })
});

http.listen(4000, () => {
  console.log('listening at http://localhost:4000');
});