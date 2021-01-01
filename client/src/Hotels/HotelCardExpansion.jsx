import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import amadeus from '../lib/amadeus.js'

const Container = styled.div`
  position: relative;
  display: flex;
  border: 1px solid black;
  flex: 1;
`;
const OfferList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  overflow-y: scroll;
  max-height: 300px;
`;
const Offer = styled.li`
  border: 1px solid green;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const InfoPanel = styled.div`
  flex: 1;
  height: 100%;
  text-align: center;
`;

const HotelCardExpansion = ({ bookingQuery, hotel, isExpanded }) => {
  const [loading, setLoading] = useState(false);
  const [roomOffers, setRoomOffers] = useState([]);

  useEffect(() => {
    bookingQuery.hotelId = hotel.hotelId;
    bookingQuery.currency = 'USD';
    setLoading(true);
    if (isExpanded) {
      // amadeus.shopping.hotelOffersByHotel.get(bookingQuery)
      amadeus.shopping.hotelOffersByHotel.get({hotelId: hotel.hotelId})
        .then((result) => {
          console.log('result', result.data)
          if (result.data) {
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
  }, [isExpanded]);

  return (
    <Container>
      {(loading) ? <InfoPanel>Room Results Loading...</InfoPanel> :
        (roomOffers.length > 0) ?
          <OfferList>
            {roomOffers.map((roomOffer) => (
              <Offer>
                <div>
                  <p>{roomOffer.id}</p>
                  <p>Room Type: {roomOffer.room.typeEstimated.category}</p>
                  {roomOffer.room.typeEstimated.bedType ? <p>Bed Type: {roomOffer.room.typeEstimated.bedType}</p> : null}
                  {roomOffer.room.typeEstimated.beds ? <p># of Beds: {roomOffer.room.typeEstimated.beds}</p> : null}
                </div>
                <div>
                  <p>Total Price: {roomOffer.price.total} {roomOffer.price.currency}</p>
                </div>
              </Offer>
            ))}
          </OfferList>
          :
          <InfoPanel>No offers found</InfoPanel>
      }
    </Container>
  );
};

export default HotelCardExpansion;