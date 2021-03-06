import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import { ApplicationProvider } from '../components/providers/ApplicationProvider.jsx';

import Flights from '../Flights/containers/FlightsContainer.js';
import Chat from '../GroupChat/containers/chatContainer.js';
import Hotels from '../Hotels/containers/HotelsContainer.js';
import ItineraryBuilder from '../ItineraryBuilder/containers/ItineraryBuilderContainer.js';
import Mapbox from '../PointsOfInterest/containers/MapboxContainer.js'
//TODO: import containerized version of components -- after they have been connected() to the redux store
import NavBar from '../components/containers/NavBarContainer.js';

const Container = styled.div`
  display: flex;
  height: 97%;
  width: 98%;
  padding: 1%;
  justify-content: space-around;
  align-items: center;
  position: relative;
  background-color: #6886c5;
  border: 1px solid black;
`;

const Section = styled.section`
  position: relative;
  height: 100%;
  margin-left: 2%;
  flex-grow: 1;
  border: 1px solid black;
  border-radius: 15px;
  background-color: #f9f9f9;
`;

const FriendTrips = () => {
  return (
    <ApplicationProvider>
      <Router>
        <Container>
          <NavBar></NavBar>
          <Section>
            <Switch>
              <Route exactly path="/itinerary">
                <ItineraryBuilder />
              </Route>
              <Route exactly path="/flights">
                <Flights />
              </Route>
              <Route exactly path="/hotels">
                <Hotels />
              </Route>
              <Route exactly path="/mapbox">
                <Mapbox />
              </Route>
              <Route>
                <Chat />
              </Route>
            </Switch>
          </Section>
        </Container>
      </Router>
    </ApplicationProvider>
  );
};

export default FriendTrips;