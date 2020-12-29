import io from 'socket.io-client';

const socket = io('http://localhost:4000', {
  path: '/socket.io',
  auth: {
    user_id: '',
    username: ''
  },
  autoConnect: false
});

export default socket;