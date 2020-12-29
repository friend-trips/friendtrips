import React, { useState, useEffect } from 'react';
import axios from 'axios'

const ApplicationContext = React.createContext();

const ApplicationProvider = (props) => {
  const [tripList, setTripList] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const getTrips = () => {
    setLoading(true);
    axios.get('https://morning-bayou-59969.herokuapp.com/trips')
      .then((result) => {
        const trips = result.data;
        console.log(trips);
        if (!selectedTrip) {
          setTripList(trips);
          setSelectedTrip(result.data[0]);
          setLoading(false);
        } else {
          setTripList(trips);
        }
      })
      .catch((err) => {
        console.log('couldnt get trips from server', err)
      })
  }


  useEffect(() => {
    getTrips()
  }, [])

  return (
    <ApplicationContext.Provider value={{ tripList, selectedTrip, loading, setSelectedTrip, getTrips }}>
      {props.children}
    </ApplicationContext.Provider>
  )
}

export { ApplicationProvider, ApplicationContext };