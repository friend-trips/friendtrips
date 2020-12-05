import React, {useState} from 'react';
import axios from 'axios';


const AuthContext = React.createContext();

const AuthProvider = ({children, helper}) => {
  const [user, setUser] = useState(null);

  const signin = (attemptedLogin, cb) => {
    axios({
      method: 'post',
      url: '/login',
      data: attemptedLogin
    })
      .then((response) => {
        console.log('USER LOGGED IN')
        setUser(document.cookie.slice(document.cookie.indexOf('=') + 1))
      })
      .catch((err) => {
        console.log('USER WAS UNABLE TO LOG IN', err)
      })
  };

  const signout = () => {
    axios({
      method: 'get',
      url: '/logout'
    })
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
    user,
    signin,
    signout
  }}>
      {children}
    </AuthContext.Provider>
  );
}

export {AuthProvider, AuthContext};