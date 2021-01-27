import { connect } from 'react-redux';
import Map from '../Mapbox.jsx';
import {getSavedPOIs, searchForPOIs} from '../actions/poiActions.js'

const mapStateToProps = (state) => {
  return {
    hotels: state.hotels.savedResults,
    // selectedTrip: state.app.selectedTrip,
    pois: state.pois.savedResults,
    searchResults: state.pois.searchResults
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSavedPOIs: () => {dispatch(getSavedPOIs())},
    searchForPOIs: (query) => {dispatch(searchForPOIs(query))}
  }
}

var MapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default MapContainer;
