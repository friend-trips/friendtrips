import { connect } from 'react-redux';
import Suggestions from '../Suggestions.jsx';

const mapStateToProps = (state) => {
  return {
    savedResults: state.flights.savedResults
  };
};

var SuggestionsContainer = connect(mapStateToProps, null)(Suggestions);

export default SuggestionsContainer;
