import io from 'socket.io-client';
const socket = io('http://localhost:4000', {
  path: '/socket.io',
  auth: {
    token: ''
  },
  autoConnect: false
});

export default socket;