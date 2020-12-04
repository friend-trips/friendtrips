import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from '../components/providers/AuthenticationProvider.jsx'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const handleSubmit = (event) => {
    event.preventDefault();
    let attemptedLogin = {username, password};
    authContext.signin(attemptedLogin);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={(e)=>{setUsername(e.target.value)}} placeholder='Username or Email'/>
        <input value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password'/>
        <button type="submit">Log In</button>
      </form>
      {(authContext.user) ? 'logged in: ' + authContext.user : 'derp' }
    </div>
  );
};

export default Login;