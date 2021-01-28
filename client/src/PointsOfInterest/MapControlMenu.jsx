import React, { useState, useEffect } from 'react';
import styled from 'styled-components'

const Container = styled.div`
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  margin: 12px;
  background-color: #404040;
  color: #ffffff;
  z-index: 1 !important;
  padding: 6px;
  width: 15%;
`;

const H5 = styled.h5`
  margin: 0;
  padding: 0;
`;

const Select = styled.select`
  width: 100%;
`;


const MapControlMenu = ({setCurrentControl, currentControl}) => {
  return (
    <Container>
      <H5 >Navigation Controls</H5>
      <Select value={currentControl} onChange={(e) => {setCurrentControl(e.target.value)}}>
        <option value='none'>None</option>
        <option value='navigator'>Navigator</option>
        <option value='geocoder'>Geocoder</option>
      </Select>
    </Container>
  );
};

export default MapControlMenu;