# Authentication

### About Authentication
Working authentication service using passport, bcrypt, and express-sessions.

### Things to do
[x] Add calls to DB for user info\
[x] Research tokens and sessions -- find an npm package that seems easy enough to figure out in a day\
[x] Create Login and Signup screens\
[] Styling on Login and Signup screens\
[x] Figure out React Router -- see if it's better to use protected routes or hacky 'conditional rendering' solution instead\
[x] Local testing\
[] Styling on all pages\
[] App layout and prep for other ~microservices~ components\

### Tech Debt
[] App.jsx imports babel-polyfill in order to make use of async/await -- this makes the bundle size huge and is probably not best practice.  A better solution would be to use a 'regenerator runtime' loader or something like that with babel and webpack\
[] Remove unnecessary files and functions\
[] Restructure code to be more modular