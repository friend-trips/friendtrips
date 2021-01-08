import { connect } from 'react-redux';
import SearchResults from '../SearchResults.jsx';
import {saveSearchResult} from '../actions/flightActions.js'

const mapDispatchToProps = (dispatch) => {
  return {
    saveSearchResult: (flight) => dispatch(saveSearchResult(flight))
  };
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.flights.isLoading,
    searchResults: state.flights.searchResults,
    selectedTrip: state.app.selectedTrip
  };
};

var SearchResultsContainer = connect(mapStateToProps, mapDispatchToProps)(SearchResults);

export default SearchResultsContainer;
