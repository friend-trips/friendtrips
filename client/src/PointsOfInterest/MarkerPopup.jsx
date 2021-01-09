import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Popup = styled.div`
  background-color: white;
`;

const MarkerPopup = ({ poi }) => {

  const [expanded, setExpanded] = useState(false);
  let popUpStyle = {
    backgroundColor: expanded ? 'white' : 'none'
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
      </div>
    </Popup>
  );
};

export default MarkerPopup;