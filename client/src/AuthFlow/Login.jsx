import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from '../components/providers/AuthenticationProvider.jsx'
import {
  Redirect,
  Link
} from 'react-router-dom';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const handleSubmit = (event) => {
    event.preventDefault();
    let attemptedLogin = {username, password};
    authContext.signIn(attemptedLogin);
  }

  return (
    <div>
      {(!authContext.user) ? <form onSubmit={handleSubmit}>
        <input value={username} onChange={(e)=>{setUsername(e.target.value)}} placeholder='Username or Email'/>
        <input value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password'/>
        <button type="submit">Log In</button>
        <Link to='/signup'>Sign Up</Link>
      </form> : <Redirect to="/home" /> }
    </div>
  );
};

export default Login;