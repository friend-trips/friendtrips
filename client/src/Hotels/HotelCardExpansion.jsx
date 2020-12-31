import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import amadeus from '../lib/amadeus.js'


const HotelCardExpansion = ({ bookingQuery, hotel, isExpanded }) => {
  const [loading, setLoading] = useState(false);
  const [roomOffers, setRoomOffers] = useState([]);
  console.log('Expansion', isExpanded)
  useEffect(() => {
    bookingQuery.hotelId = hotel.hotelId;
    setLoading(true);
    if (isExpanded) {
      amadeus.shopping.hotelOffersByHotel.get(bookingQuery)
        .then((result) => {
          console.log('result', result.data)
          if (result.data.available) {
            console.log('found', result.data.offers.length, 'results')
            setRoomOffers(result.data.offers);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log('error finding room offers', err)
          setLoading(false);
        })
    }
  }, [isExpanded])

  return (
    <div style={{  backgroundColor: 'orange', position: 'relative', display: 'flex', border: '1px solid black', flex: 1 }}>
      {loading}
      {(loading) ? <div>Room Results Loading...</div> :
        (roomOffers.length > 0) ?
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid white', padding: '1%', overflowX: 'scroll' }}>
              {roomOffers.map((roomOffer) => (
                <div style={{border: '1px solid green', minHeight: '5%', width: '100%'}}>
                  <p>{roomOffer.id}</p>
                  <p>{roomOffer.description}</p>
                  <p>{roomOffer.price.total}</p>
                </div>
              ))}
          </div>
          :
          <p>no offers found</p>
      }
    </div>
  );
};

export default HotelCardExpansion;