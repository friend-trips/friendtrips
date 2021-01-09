import { connect } from 'react-redux';
import Map from '../Mapbox.jsx';


const mapStateToProps = (state) => {
  return {
    hotels: state.hotels.savedResults
  }
}


var MapContainer = connect(mapStateToProps, null)(Map);

export default MapContainer;
