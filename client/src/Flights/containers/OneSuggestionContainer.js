import { connect } from 'react-redux';
import OneSuggestion from '../OneSuggestion.jsx';
import {voteOnSuggestion} from '../actions/flightActions.js'

const mapDispatchToProps = (dispatch) => {
  return {
    voteOnSuggestion: (vote) => dispatch(voteOnSuggestion(vote))
  };
};

var OneSuggestionContainer = connect(null, mapDispatchToProps)(OneSuggestion);

export default OneSuggestionContainer;
