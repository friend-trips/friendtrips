import { connect } from 'react-redux';
import HotelSuggestions from '../HotelSuggestions.jsx';

const mapStateToProps = (state) => {
  return {
    savedResults: state.hotels.savedResults
  };
};


var HotelSuggestionsContainer = connect(mapStateToProps, null)(HotelSuggestions);

export default HotelSuggestionsContainer;
