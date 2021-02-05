import io from 'socket.io-client';
// const urlStr = 'http://localhost:4000'
const socket = io(`https://friendtrips.herokuapp.com/${process.env.PORT || 4000}`, {
  path: '/socket.io',
  auth: {
    user_id: '',
    username: ''
  },
  autoConnect: false
});

export default socket;