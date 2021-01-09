import React, { useState, useEffect, useContext } from 'react';
import {AuthContext} from '../components/providers/AuthenticationProvider.jsx'
import styled from 'styled-components';
import axios from 'axios';

const Popup = styled.div`
  background-color: white;
`;

const MarkerPopup = ({ poi, selectedTrip }) => {
  const [expanded, setExpanded] = useState(false);
  const [isSaved, setSaved] = useState(poi.isSaved);

  const authContext = useContext(AuthContext);
  const savePOI = (poi) => {
    let newPOI = {
      trip_id: selectedTrip.trip_id,
      user_id: authContext.user,
      poi_id: poi.id,
      name: poi.name,
      category: poi.category,
      tags: poi.tags,
      latitude: poi.geoCode.latitude,
      longitude: poi.geoCode.longitude,
      created: new Date()
    }
    axios({
      method: 'post',
      url: 'http://localhost:4001/pois',
      data: newPOI,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((response) => {
        console.log('post poi response, ', response);
        setSaved(true);
      })
      .catch(console.log)
  }

  let popUpStyle = {
    backgroundColor: isSaved ? 'green' : 'transparent'
  }
  return (
    <Popup style={popUpStyle} onClick={() => { setExpanded(!expanded) }}>
      {poi.category === 'RESTAURANT' ?
      <ion-icon name="restaurant-outline" style={{height: '25px', width: '25px', backgroundColor: 'none'}}/> :
      <ion-icon name="eye-outline" style={{height: '25px', width: '25px', backgroundColor: 'none'}}/>
      }
      <div style={{ display: expanded ? 'block' : 'none', backgroundColor: expanded ? 'white' : 'none', border: '1px solid black' }} >
        <p>{poi.name}</p>
        <p>{poi.category}</p>
        <button onClick={() => {savePOI(poi)}}>Save</button>
      </div>
    </Popup>
  );
};

export default MarkerPopup;