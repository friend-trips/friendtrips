import { connect } from 'react-redux';
import Map from '../ReactMapGl.jsx';


const mapStateToProps = (state) => {
  return {
    selectedTrip: state.app.selectedTrip
  }
}


var MapContainer = connect(mapStateToProps, null)(Map);

export default MapContainer;
