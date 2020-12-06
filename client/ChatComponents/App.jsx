import React, { useState, useEffect, useRef } from 'react';
import Chat from './Chat.jsx'

const App = () => {

  const [username, setUsername] = useState('');
  const [signedIn, setSignIn] = useState(false);

  return (
    <div>
      {(signedIn) ?
        <div>
          <p>{username}</p>
          <Chat authUser={username} />
          <button onClick={() => { setSignIn(false) }}>SignOut</button>
        </div>
        :
        <form onSubmit={(e) => { e.preventDefault(); setSignIn(true) }}>
          <input value={username} onChange={(e) => {
            setUsername(e.target.value)
          }}></input>
          <button type='submit'>Sign-in</button>
        </form>
      }
    </div>
  );
};

export default App;