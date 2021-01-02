import React, { useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { AuthContext } from './providers/AuthenticationProvider.jsx'

import PrivateRoute from './wrappers/PrivateRoute.jsx';
import Login from '../AuthFlow/Login.jsx';
import SignUp from '../AuthFlow/Signup.jsx';
import FriendTrips from './FriendTrips.jsx';

const Application = styled.div`
  position: absolute;
  // height: 100%;
  // width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ##0F4C81;
  overflow: hidden;
`;

const App = () => {
  const authContext = useContext(AuthContext)
  return (
    <Router style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Application>
        <Switch>
          <Route exact path="/">
            {authContext.user ? <Redirect to="/home" /> : <Redirect to="/login" />}
          </Route>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <PrivateRoute path="/home">
            <FriendTrips />
          </PrivateRoute>
        </Switch>
      </Application>
    </Router>
  );
};

export default App;
