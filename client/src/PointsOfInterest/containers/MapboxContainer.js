import { connect } from 'react-redux';
import Map from '../Mapbox.jsx';
import {getSavedPOIs, searchForPOIs, saveSearchResult} from '../actions/poiActions.js'

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
    getSavedPOIs: (cb) => {dispatch(getSavedPOIs(cb))},
    searchForPOIs: (query) => {dispatch(searchForPOIs(query))},
    saveSearchResult: (poi) =>{dispatch(saveSearchResult(poi))}
  }
}

var MapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default MapContainer;
