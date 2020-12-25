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
    isLoading: state.isLoading,
    searchResults: state.searchResults
  };
};

var SearchResultsContainer = connect(mapStateToProps, mapDispatchToProps)(SearchResults);

export default SearchResultsContainer;
