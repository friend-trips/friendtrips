import { connect } from 'react-redux';
import {saveSearchResult} from '../actions/poiActions.js'
import POIToolTip from '../POIToolTip.jsx'

const mapDispatchToProps = (dispatch) => {
  return {
    saveSearchResult: (poi) => {dispatch(saveSearchResult(poi))}
  }
}

var POIToolTipContainer = connect(null, mapDispatchToProps)(POIToolTip);

export default POIToolTipContainer;
