import React from 'react';
import Login from './Login.jsx';
import SignUp from './Signup.jsx'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>Ahoy Cap't! App is Running!
        <Login></Login>
        <SignUp></SignUp>
      </div>
    )
  };
}

export default App;
