import React, { useState, useEffect, useContext } from 'react';
import {ApplicationContext} from '../components/providers/ApplicationProvider.jsx';
import {AuthContext} from '../components/providers/AuthenticationProvider.jsx';
import styled from 'styled-components';
import amadeus from '../lib/amadeus.js'
import axios from 'axios';
import App from './Hotels.jsx';
import Heart from '../components/Heart.jsx'
import Share from '../components/Share.jsx'

const Container = styled.div`
  position: relative;
  display: flex;
  height: 98%;
  padding: 1%;
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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;
const CenterSection = styled.div`
  width: 75%;
  text-transform: capitalize;

  p {
    margin: 2px;
    padding: 2px;
  }
`;
const PriceSection = styled.div`
  width: 25%;
  border-left: 1px solid black;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 5px;
`;
const Price = styled.div`
  // font-size: 24px;
  font-weight: bold;
  color: green;
`;
const PriceInfo = styled.p`
  font-size: .75em;
  font-weight: 200;
  padding: 0;
  margin: 0;
`;
const Save = styled.div`
  position: absolute;
  height: 10%;
  width: 10%;
  right: 10%;
  top: 10%;
  cursor: pointer;
`;
const Suggest = styled.div`
  position: absolute;
  height: 10%;
  width: 10%;
  right: 10%;
  bottom: 20%;
  cursor: pointer;
`;

const HotelCardExpansion = ({ bookingQuery, hotel, isExpanded, saveSearchResult }) => {
  const [loading, setLoading] = useState(false);
  const [roomOffers, setRoomOffers] = useState([]);
  const [numOfDays, setNumOfDays] = useState(0);
  const appContext = useContext(ApplicationContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    let timeBetweenDate = new Date(bookingQuery.checkOutDate).getTime() - new Date(bookingQuery.checkInDate).getTime();
    const millisecondsInADay = (1000 * 3600 * 24);
    console.log('gotDates', bookingQuery.checkOutDate,  bookingQuery.checkInDate, timeBetweenDate)
    setNumOfDays(timeBetweenDate / millisecondsInADay)
  }, [])

  useEffect(() => {
    bookingQuery.hotelId = hotel.hotelId;
    bookingQuery.currency = 'USD';
    setLoading(true);
    if (isExpanded) {
      amadeus.shopping.hotelOffersByHotel
      .get(bookingQuery)
      .then((result) => {
        if (result.data) {
          console.log('found', result.data.offers.length, 'results')
          setRoomOffers(result.data.offers);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log('error finding room offers', err)
      })
    }
  }, [isExpanded]);


  const save = function (offer, isSuggested) {
    const hotelData = {
      trip_id: appContext.selectedTrip.trip_id,
      user_id: authContext.user,
      check_in_date: bookingQuery.checkInDate,
      check_out_date: bookingQuery.checkOutDate,
      room_quantity: bookingQuery.roomQuantity,
      adults: bookingQuery.adults,
      hotel_name: hotel.name,
      hotel_address: hotel.address,
      city_code: hotel.cityCode,
      rating: hotel.rating ? hotel.rating : 5,
      amenities: hotel.amenities,
      distance_from_city_center: hotel.milesFromCenter.toString(),
      is_suggested: isSuggested ? "true" : "false",
      is_saved: "true",
      num_of_nights: numOfDays,

      number_of_reviews: 1,
      number_of_ratings: 1,
      overall_ratings: 1,
      sleep_quality_rating: 1,
      service_rating: 1,
      facilities_rating: 1,
      room_comforts_rating: 1,
      value_for_money_rating: 1,
      catering_rating: 1,
      location_rating: 1,
      points_of_interest_rating: 1,
      staff_rating: 1,
      hotel_id: hotel.hotelId,

      offer_id: offer.id,
      price: offer.price.total,
      currency: offer.price.currency,
      room_type: offer.room.typeEstimated.category ? offer.room.typeEstimated.category.split('_')[0].toLowerCase() : '',
      bed_type: (offer.room.typeEstimated.bedType) ?
      offer.room.typeEstimated.bedType.toLowerCase() : '',
      number_of_beds: (offer.room.typeEstimated.beds) ? offer.room.typeEstimated.beds : 0
    };

    saveSearchResult(hotelData);
  };
  return (
    <Container>
      {(loading) ? <InfoPanel>Room Results Loading...</InfoPanel> :
        (roomOffers.length > 0) ?
          <OfferList>
            {roomOffers.map((roomOffer) => (
              <Offer>
                <CenterSection>
                  <p>{roomOffer.id}</p>
                  <p>Room Type: {roomOffer.room.typeEstimated.category.split('_')[0].toLowerCase()}</p>
                  {roomOffer.room.typeEstimated.bedType ? <p>Bed Type: {roomOffer.room.typeEstimated.bedType.toLowerCase()}</p> : null}
                  {roomOffer.room.typeEstimated.beds ? <p># of Beds: {roomOffer.room.typeEstimated.beds}</p> : null}
                </CenterSection>
                <PriceSection>
                  <Save onClick={() => save(false)}>
                    <Heart/>
                  </Save>
                  <Suggest onClick={() => save(roomOffer, true)}>
                    <Share/>
                  </Suggest>
                  <Price>
                    {Math.floor(roomOffer.price.total / numOfDays)} {roomOffer.price.currency}
                    <PriceInfo>Nightly price per room</PriceInfo>
                  </Price>
                </PriceSection>
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