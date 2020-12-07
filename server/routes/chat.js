const axios = require('axios');
module.exports = function (io) {
  return function (req, res, next) {
    console.log('CHAT ROUTE ')
    let countOfConnections = 0;
    let messages = [];
    //on 'connection', io returns an object representing the client's socket
    io.on('connection', (socket) => {
      countOfConnections++;
      io.emit('connectedUsers', countOfConnections)
      socket.on('greeting', () => {
        if (messages.length === 0) {
          axios({
            method: 'get',
            url: `https://morning-bayou-59969.herokuapp.com/messages/?trip_id=${1}`,
          })
            .then((result) => {
              if (messages.length === 0) {
                messages = result.data;
                let newMsg = {
                  user_id: Number(socket.handshake.auth.user_id),
                  trip_id: 1,
                  message: 'joined the room'
                }
                messages.push(newMsg);
                // console.log(messages);
                io.emit('updatedMessages', messages);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          let newMsg = {
            user_id: Number(socket.handshake.auth.user_id),
            trip_id: 1,
            message: 'joined the room'
          }
          messages.push(newMsg);
          io.emit('updatedMessages', messages);
        }
      })

      socket.on('disconnect', () => {
        console.log('user disconnected');
        countOfConnections--;
        io.emit('connectedUsers', countOfConnections);
        let newMsg = {
          user_id: Number(socket.handshake.auth.user_id),
          // username: socket.handshake.auth.username,
          trip_id: 1,
          message: 'has left the room'
        }
        messages.push(newMsg);
        io.emit('updatedMessages', messages);
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
        console.log(' c', newComment)
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

    next();
  }
};