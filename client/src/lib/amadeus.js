import keys from '../../../config.js'

var Amadeus = require("amadeus");
var amadeus = new Amadeus({
  clientId: keys.clientId,
  clientSecret: keys.clientSecret,
});
export default amadeus;