import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
// import { AuthContext } from '../components/providers/AuthenticationProvider.jsx';
import Page from './Page.jsx'
import Chat from '../GroupChat/Chat.jsx';
import ItineraryBuilder from '../ItineraryBuilder/ItineraryBuilder.jsx';
import Flights from '../Flights/Flights.jsx';
import Hotels from '../Hotels/Hotels.jsx';

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
  position: relative;
`;

const Section = styled.section`
position: relative;
  height: 100%;
  margin-left: 2%;
  flex-grow: 1;
  border: 1px solid black;
`;

const FriendTrips = () => {
  return (
    <Router>
      <Container>
        <NavBar></NavBar>
        <Section>
          <Switch>
            <Route exactly path="/chat">
              <Chat/>
            </Route>
            <Route exactly path="/itinerary">
              <ItineraryBuilder/>
            </Route>
            <Route exactly path="/flights">
              <Flights/>
            </Route>
            <Route exactly path="/hotels">
              <Hotels/>
            </Route>
          </Switch>
        </Section>
      </Container>
    </Router>
  );
};

export default FriendTrips;