// import keys from '../../../config.js'

var Amadeus = require("amadeus");
let amadeus;
if (!process.env.AMADEUS_CLIENT) {
  import('../../../config.js')
    .then((r) => {
      amadeus = new Amadeus({
        clientId: r.clientId,
        clientSecret: r.clientSecret,
      });
    })
    .catch((err) => { console.log('import err', err)})
} else {
  amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT,
      clientSecret: process.env.AMADEUS_SECRET,
    });
}
// var amadeus = new Amadeus({
//   clientId: process.env.REACT_APP_AMADEUS_CLIENT,
//   clientSecret: process.env.REACT_APP_AMADEUS_SECRET,
// });

// var amadeus = new Amadeus({
//   clientId: keys.clientId,
//   clientSecret: keys.clientSecret,
// });
export default amadeus;