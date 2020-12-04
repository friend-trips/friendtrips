import React, {useContext} from 'react';
import {AuthContext} from '../providers/AuthenticationProvider.jsx';
import {
  Route,
  Redirect
} from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
  let auth = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute