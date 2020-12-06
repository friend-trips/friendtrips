import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../components/providers/AuthenticationProvider.jsx';
import Page from './Page.jsx'
import Chat from '../../ChatComponents/Chat.jsx'

import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from 'react-router-dom';

import NavBar from './NavBar.jsx';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-around;
  align-items: center;
`;

const Section = styled.section`
  height: 100%;
  margin-left: 2%;
  flex-grow: 1;
  border: 1px solid black;
`;

const FriendTrips = () => {
  const authContext = useContext(AuthContext);
  return (
    <Router>
      <Container>
        <NavBar></NavBar>
        <Section>
          <Switch>
            <Route exactly path="/red">
              <Chat authUser={authContext.user}/>
            </Route>
            <Route exactly path="/blue">
              <Page color={'blue'}></Page>
            </Route>
            <Route exactly path="/green">
              <Page color={'green'}></Page>
            </Route>
            <Route exactly path="/yellow">
              <Page color={'yellow'}></Page>
            </Route>
          </Switch>
        </Section>
      </Container>
    </Router>
  );
};

export default FriendTrips;