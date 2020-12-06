# Friendtrips

### About Friendtrips
Application

### Things to do
[] Add Global Styling\
[] Add Hotels component\
[] Add updates from Flight components\
[] Figure out why leaving comments breaks the chat\
  - Current hypothesis: after the comment is successfully posted, the entire messages list is refreshed (this expected behavior).  However, refreshing the list of messages seems to be remouting the component (or something like that) and thus 'wiping' the thread state (meaning that the new comment is trying to be mounted without a 'parent' message to attach to -- a react no-go that crashes the app).\
[] Finish Itinerary Builder\
[] Create Suggestions modal\
[] Refactor imported components (Flights, hotels, ItinBuilder etc) to grant access to user variables through AuthContext\
[] Create Trip selector drop down for the Navbar\
[] Create Login and Signup components\
[] Create Splash page\
[] Testing (lol)


### Tech Debt
[] server/index.js is a mess because of the socket.io stuff -- would be nice if this could all live in middleware but I haven't figured out how to do that yet\