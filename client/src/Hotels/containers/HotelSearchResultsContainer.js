import { connect } from 'react-redux';
import HotelSearchResults from '../HotelSearchResults.jsx';


const mapStateToProps = (state) => {
  return {
    isLoading: state.hotels.isLoading,
    searchResults: state.hotels.searchResults
  };
};

var HotelSearchResultsContainer = connect(mapStateToProps, null)(HotelSearchResults);

export default HotelSearchResultsContainer;
