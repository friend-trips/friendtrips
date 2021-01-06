import React, { useContext } from 'react';
import axios from 'axios'
import {AuthContext} from './AuthenticationProvider.jsx';
import useSocket from '../hooks/useSocket.js'


const ApplicationContext = React.createContext();

const ApplicationProvider = (props) => {

  const authContext = useContext(AuthContext);
  const emitChange = useSocket(authContext.user, authContext.username);

  return (
    <ApplicationContext.Provider value={{ emitChange }}>
      {props.children}
    </ApplicationContext.Provider>
  )
}

export { ApplicationProvider, ApplicationContext };