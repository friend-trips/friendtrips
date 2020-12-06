import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../components/providers/AuthenticationProvider.jsx';
import { Link } from 'react-router-dom';

const Container = styled.nav`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  min-height: 100%;
  width: 20%;
`

const NavBar = () => {

  const authContext = useContext(AuthContext);
  return (
    <Container>
      <div>
        Welcome back{(authContext.username) ? ', ' + authContext.username : null}!
            <div >
          <ul >
            <li >
              <Link to="/red">Red</Link>
            </li>
            <li >
              <Link className="Nav__link" to="/blue">Blue</Link>
            </li>
            <li >
              <Link className="Nav__link" to="/green">Green</Link>
            </li>
            <li>
              <Link className="Nav__link" to="/yellow">Yellow</Link>
            </li>
          </ul>
        </div>
      </div>
      <button onClick={authContext.signOut}>Log out</button>
    </Container>
  );
};

export default NavBar;