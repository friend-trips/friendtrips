import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/providers/AuthenticationProvider.jsx'
import {
  Redirect,
  Link
} from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0F4C81;
`;
const Content = styled.section`
  position: relative;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-content: spaced-evenly;
  width: 30%;
  height: 50%;
  background-color: #FFFFFF;
`
const Header = styled.header`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
`;
const H2 = styled.h2`

`;
const Form = styled.form`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding-top: 2%;
  padding-bottom: 2%;
  border-top: 1px solid black;
  border-radius: 10px;
  background-color: #F0F8FF;
`;
const Field = styled.div`
  width: 80%;
  height: 20%;
  display: flex;
  flex-direction: column;
`;
const Input = styled.input`
  flex: 1;
  height: 60%;
  min-width: 90%;
`;
const Button = styled.button`
  margin-top: 2%;
  width: 40%;
  height: 10%;
  font-weight: bold;
  font-size: 16px;
  background-color: #0F4C81;
  color: white;
`;
const Label = styled.label`
  text-align: left;
  height: 40%;
`;
const P = styled.p`
  font-size: 12px;
  margin: 0;
  pardding: 0;
`;


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const handleSubmit = (event) => {
    event.preventDefault();
    let attemptedLogin = { username, password };
    authContext.signIn(attemptedLogin);
  }

  return (
    <Container>
      {(!authContext.user) ?
        <Content>
          <Header>
            <H2>Login</H2>
          </Header>
          <Form onSubmit={handleSubmit}>
            <Field>
              <Label>Username</Label>
              <Input value={username} onChange={(e) => { setUsername(e.target.value) }} placeholder='Username or Email' />
            </Field>
            <Field>
              <Label>Password</Label>
              <Input value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' />
            </Field>
            <Button type="submit">Sign In</Button>
            <P>Don't have an account? <Link to='/signup'>Sign Up</Link> </P>

          </Form>
        </Content> :
        <Redirect to="/home" />}
    </Container>
  );
};

export default Login;