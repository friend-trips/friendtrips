import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../components/providers/AuthenticationProvider.jsx';
import { Link } from 'react-router-dom';

const Container = styled.nav`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  min-height: 100%;
  min-width: 20%;
`
const Header = styled.header`
  display: flex;
`
const NavigationLinks = styled.div``;
const UL = styled.ul``
const LI = styled.li``
const Button = styled.button``

const NavBar = () => {

  const authContext = useContext(AuthContext);
  return (
    <Container>
      <div>
        <Header>
          Welcome back{(authContext.username) ? ', ' + authContext.username : null}!
        </Header>
        <NavigationLinks>
          <UL >
            <LI>
              <Link to="/chat">Chat</Link>
            </LI>
            <LI>
              <Link to="/itinerary">Itinerary Builder</Link>
            </LI>
            <LI>
              <Link to="/flights">Flights</Link>
            </LI>
            <LI>
              <Link to="/hotels">Hotels</Link>
            </LI>
          </UL>
        </NavigationLinks>
      </div>
      <Button onClick={authContext.signOut}>Log out</Button>
    </Container>
  );
};

export default NavBar;