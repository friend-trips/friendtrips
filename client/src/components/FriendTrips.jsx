import React, {useState, useEffect, useContext} from 'react';

import {AuthContext} from '../components/providers/AuthenticationProvider.jsx'

const FriendTrips = () => {
  const authContext = useContext(AuthContext);
  return (
    <div>
      FRIENDTRIPS
      <button onClick={authContext.signout}>Log out</button>
    </div>
  );
};

export default FriendTrips;