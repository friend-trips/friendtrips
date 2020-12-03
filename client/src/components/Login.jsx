import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    let attemptedLogin = {username, password};
    axios({
      method: 'post',
      url: '/auth',
      data: attemptedLogin
    })
      .then((response) => {
        console.log('YAY')
      })
      .catch((err) => {
        console.log('SHIT')
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={(e)=>{setUsername(e.target.value)}} placeholder='Username or Email'/>
        <input value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password'/>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;