# Friendtrips

### About Friendtrips
Travel days are more fun with a friend. Use the Flights tab to search for the perfect route and
suggest it to the group. Vote for routes that work for you.

A perfect place to stay can make or break your trip. Use the Hotels tab to search for the ideal hotel and suggest it to the group. Use the distance from the city center and the rating to inform your decision about what to suggest. Vote for the hotel suggestion that you like the best.

Build your own itinerary using any of the suggestions that have been made by the group. Find and view each trip member’s individual itinerary in the “Itinerary Builder” tab. Work together to create a master itinerary that will form the backbone of your trip!


### How to Start this Application
```
npm install
npm start

// navigate to http://localhost:4000
// create your own sign in, or log in with one of our friend's accounts!
  username: Cameron
  password: pokemon
```

![chatsImg](https://github.com/friend-trips/friendtrips/blob/main/public/assets/images/Screen%20Shot%202020-12-09%20at%2012.42.21%20PM.png)
![flightsImg](https://github.com/friend-trips/friendtrips/blob/main/public/assets/images/Screen%20Shot%202020-12-09%20at%2012.44.39%20PM.png)
![hotelsImg](https://github.com/friend-trips/friendtrips/blob/main/public/assets/images/Screen%20Shot%202020-12-09%20at%2012.45.45%20PM.png)

### Notes on running this application

You will want to create a config folder (at the root) to hold all of your client secrets.  You will need to create an amadeus.config.js and an environment.config.js

- FriendTrips
 -  client
 -> configs
   -> amadeus.config.js
   -> environment.config.js
 -  public
 -  server
 
//amadeus.config.js
module.exports = {
  clientId: 'fVXmfiyi0x08BRIRjPPigsfUZsTG7kf3',
  clientSecret: 'oMQaNklAzUaCswoo'
}

//environment.config.js
module.exports = {
  SESS_SECRET: 'CaNtALoUpE',
  AUTH_ROUTE: 'https://morning-bayou-59969.herokuapp.com/auth/check_user',
  USER_ROUTE: 'https://morning-bayou-59969.herokuapp.com/users'
}
