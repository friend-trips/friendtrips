import { connect } from 'react-redux';
import NavBar from '../NavBar.jsx';
import {getTripList, getTripData} from '../../FriendTrips/actions/FriendTripsActions.js'

const mapDispatchToProps = (dispatch) => {
  return {
    getTripList: () => dispatch(getTripList()),
    getTripData: (id) => dispatch(getTripData(id))
  };
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.app.isLoading,
    tripList: state.app.tripList,
    selectedTrip: state.app.selectedTrip,
  };
};

var NavBarContainer = connect(mapStateToProps, mapDispatchToProps)(NavBar);

export default NavBarContainer;
