import io from 'socket.io-client';
<<<<<<< HEAD
// const urlStr = 'http://localhost:4000'
const socket = io(`https://friendtrips.herokuapp.com/${process.env.PORT || 4000}`, {
=======

const serverURL = process.env.PORT ? `https://friendtrips.herokuapp.com/${process.env.PORT}` : 'http://localhost:4000';
const socket = io(serverURL, {
>>>>>>> staging
  path: '/socket.io',
  auth: {
    user_id: '',
    username: ''
  },
  autoConnect: false
});

export default socket;