import React from 'react';
import PrivateRoute from './wrappers/PrivateRoute.jsx'

import {AuthProvider} from './providers/AuthenticationProvider.jsx'
import Login from './Login.jsx';
import SignUp from './Signup.jsx'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from 'react-router-dom';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/login">Login Page</Link>
            </li>
            <li>
              <Link to="/signup">Signup Page</Link>
            </li>
          </ul>

          <Switch>
            <Route exact path="/">
              <div>Home</div>
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <PrivateRoute path="/protected">
              {/* <Carrots/> */}
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
