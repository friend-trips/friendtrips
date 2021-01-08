import React, {useState, useEffect} from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [user, setUser] = useState(7);
  const [username, setUsername] = useState('Fred')
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = (attemptedLogin) => {
      axios({
        method: 'post',
        url: '/auth/login',
        data: attemptedLogin
      })
        .then((response) => {
          console.log('USER LOGGED IN', response.data);
          setUsername(response.data.username)
          setUser(response.data.user_id)
        })
        .catch((err) => {
          console.log('USER WAS UNABLE TO LOG IN', err)
        })
  }

  const signOut = () => {
      axios.get('/auth/logout')
      setUser(null);
      setUsername('');
  }

  const checkStatus = () => {
      axios.get('/auth/check')
        .then((result) => {
          console.log('You have been authenticated', result);
          setUser(result.data.user_id);
          setUsername(result.data.username);
          return result.data;
        })
        .catch(() => {
          console.log('You have not been authenticated');
        })
  }

  useEffect(() => {
    const user = checkStatus();
  }, [])

  return (
    <AuthContext.Provider value={{ user, username, signIn, signOut, checkStatus }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext };