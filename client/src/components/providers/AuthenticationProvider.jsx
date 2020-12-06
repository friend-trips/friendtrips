//Yes, this file is actually this empty.  Most of the setup for this AuthContext was done in App.jsx.  Migrating those functions here is technical debt.

import React from 'react';

const AuthContext = React.createContext();

export {AuthContext};