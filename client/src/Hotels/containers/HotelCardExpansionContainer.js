import { connect } from 'react-redux';
import HotelCardExpansion from '../HotelCardExpansion.jsx';
import {saveSearchResult} from '../actions/hotelActions.js'

const mapDispatchToProps = (dispatch) => {
  return {
    saveSearchResult: (hotel) => dispatch(saveSearchResult(hotel))
  };
};


var HotelCardExpansionContainer = connect(null, mapDispatchToProps)(HotelCardExpansion);

export default HotelCardExpansionContainer;
