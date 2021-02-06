import io from 'socket.io-client';

const serverURL = process.env.PORT ? `https://friendtrips.herokuapp.com/${process.env.PORT}` : 'http://localhost:4000';
const socket = io(serverURL, {
  path: '/socket.io',
  auth: {
    user_id: '',
    username: ''
  },
  autoConnect: false
});

export default socket;