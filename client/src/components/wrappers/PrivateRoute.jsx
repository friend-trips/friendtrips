import React, {useContext} from 'react';
import {AuthContext} from '../providers/AuthenticationProvider.jsx';
import {
  Route,
  Redirect
} from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
  let auth = useContext(AuthContext);
  const renderChildComponents = ({ location }) => {
          return auth.user ? children : <Redirect to={{ pathname: "/login", state: { from: location } }}/>
    }
  return (
    <Route
      {...rest}
      render={renderChildComponents}
    />
  );
}

export default PrivateRoute