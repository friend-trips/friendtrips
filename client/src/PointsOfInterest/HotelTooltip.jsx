import React, { useState, useEffect } from 'react';

const HotelTooltip = ({hotel, searchNearHotel}) => {
  return (
    <div>
      <p>{hotel.hotel_name}</p>
      <p>{hotel.hotel_address}</p>
      <button onClick={() => { searchNearHotel(hotel.longitude, hotel.latitude) }}> POI Search </button>
    </div>
  );
};

export default HotelTooltip;