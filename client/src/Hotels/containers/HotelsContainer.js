import { connect } from 'react-redux';
import Hotels from '../Hotels.jsx';
import {getSavedHotels, searchForHotels} from '../actions/hotelActions.js'

const mapDispatchToProps = (dispatch) => {
  return {
    getSavedHotels: () => dispatch(getSavedHotels()),
    searchForHotels: (query) => dispatch(searchForHotels(query))
  };
};

var HotelsContainer = connect(null, mapDispatchToProps)(Hotels);

export default HotelsContainer;
