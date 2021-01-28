import React, { useContext } from 'react';
import {AuthContext} from '../components/providers/AuthenticationProvider.jsx'
import axios from 'axios'

const POIToolTip = ({poi, saveSearchResult}) => {
  const authContext = useContext(AuthContext);
  const savePOI = () => {
    //TODO: figure out why authContext returns undefined here
    let newPOI = {
      trip_id: 1,
      user_id: 7,
      poi_id: poi.id,
      name: poi.name,
      category: poi.category,
      tags: poi.tags,
      latitude: poi.geoCode.latitude,
      longitude: poi.geoCode.longitude,
      created: new Date()
    }
    saveSearchResult(newPOI);
  }
  return (
    <div>
      <p>{poi.name}</p>
      <p>{poi.category}</p>
      {!poi.isSaved ?
      <button onClick={() => { savePOI() }}> Save </button>:
      null
      }
    </div>
  );
};

export default POIToolTip;