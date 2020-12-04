import React, {useState} from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const signin = attemptedLogin => {
    axios({
      method: 'post',
      url: '/login',
      data: attemptedLogin
    })
      .then((response) => {
        console.log('YAY', document.cookie, typeof document.cookie)
        setUser(document.cookie.slice(document.cookie.indexOf('=') + 1))
      })
      .catch((err) => {
        console.log('SHIT')
      })
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
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