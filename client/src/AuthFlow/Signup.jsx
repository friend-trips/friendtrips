import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom'

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnteredPassword, setReEnteredPassword] = useState('')
  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    if (password === reEnteredPassword && email !== '' && username !== '') {
      let attemptedSignUp = {username, email, password};
      axios({
        method: 'post',
        url: '/auth/register',
        data: attemptedSignUp
      })
        .then((response) => {
          history.push('/login')
        })
        .catch((err) => {
          console.log('SHIT', err)
        })
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e)=>{setUsername(e.target.value)}} placeholder='Username'
        />
        <input
          value={email}
          onChange={(e)=>{setEmail(e.target.value)}}
          placeholder='E-mail'
        />
        <input
          value={password}
          onChange={(e)=>{setPassword(e.target.value)}}
          placeholder='Password'
        />
        <input
          value={reEnteredPassword}
          onChange={(e)=>{setReEnteredPassword(e.target.value)}}
          placeholder='Re-enter Password'
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;