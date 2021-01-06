import { connect } from 'react-redux';
import HotelCardExpansion from '../HotelCardExpansion.jsx';
import {saveSearchResult} from '../actions/hotelActions.js'

const mapDispatchToProps = (dispatch) => {
  return {
    saveSearchResult: (hotel) => dispatch(saveSearchResult(hotel))
  };
};

const mapStateToProps = (state) => {
  return {
    selectedTrip: state.app.selectedTrip
  }
}


var HotelCardExpansionContainer = connect(mapStateToProps, mapDispatchToProps)(HotelCardExpansion);

export default HotelCardExpansionContainer;
