import React, { useContext, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../components/providers/AuthenticationProvider.jsx";
import { ApplicationContext } from "../components/providers/ApplicationProvider.jsx";
import axios from "axios";

import Expansion from './containers/HotelCardExpansionContainer.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid black;
  min-width: 100%;
  min-height: 30%;
  max-height: 80%;
  position: relative;
  transition: max-height 0.2s ease-out;
  overflow: hidden;
`;

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid black;
  min-width: 100%;
  transition: height 0.2s ease-out;
  flex: 1;
`;

const ExpandedSection = styled.section`
  position: relative;
  height: 0px;
  overflow: hidden;
  transition: height 0.2s ease-out;
  display; flex;
`;
const HotelImageWrapper = styled.div`
  flex: 1;
  width: 25%;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const HotelImage = styled.img`
  max-height: 50%;
  max-width: 80%;
  background-color: white;
  margin-left: 4%;
  object-fit: contain;
`;

const CenterSection = styled.div`
  background-color: #ffffff;
  border: 1px solid #fff;
  flex: 2;
  width: 75%;
  display: flex;
  flex-direction: column;
  padding: 2%;
  position: relative;
`;
const HotelInfo = styled.div`
  width: 70%;
  height: 50%;
  display: flex;
  flex-direction: column;
`;
const HotelName = styled.h4`
  margin: 0;
  font-weight: 300;
  align-self: flex-start;
  transform: translate(-37%, 0px);
  width: 200%;
`;

const HotelAddress = styled.h5`
  margin: 0;
  font-size: 11px;
  font-weight: 200;
  // transform: translate(0px, 200%);
`;
const Amenities = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;
const AmenitySectionTitle = styled.p`
  font-size: 12px;
  font-weight: 200;
  padding: 0;
`;
const AmenitiesInfo = styled.p`
  font-size: 10px;
  font-weight: 200;
  padding: 0;
  margin: 0;
`;
const Amenity = styled.p`
  font-size: 12px;
  font-weight: 200;
  border: 1px solid black;
  margin: 2px;
  padding: 2px;
`;

const Rating = styled.div`
  position: absolute;
  right: 5%;
  top: 30%;
  border: 1px solid black;
  border-radius: 3px;
  min-height: 50px;
  width: 20%;
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  box-shadow: 2px 2px 2px;
`;

const PricePane = styled.div`
  width: 25%;
  border-left: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Price = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: green;
`;
const PriceInfo = styled.p`
  font-size: 12px;
  font-weight: 200;
  padding: 0;
  margin: 0;
`;
const Save = styled.div`
  position: absolute;
  height: 8%;
  width: 8%;
  right: 10%;
  top: 10%;
  cursor: pointer;
`;
const Suggest = styled.div`
  position: absolute;
  height: 8%;
  width: 8%;
  right: 10%;
  bottom: 10%;
  cursor: pointer;
`;


const ratingStrings = ["none", "Poor", "Fair", "Good", "Great", "Excellent"];

export default function HotelCard({ HotelData, searchQuery }) {
  const [isExpanded, setExpanded] = useState(false);

  let amenities = HotelData.amenities ? HotelData.amenities : [];
  amenities = amenities.map((perk) => {
    return perk.replace("_", " ").toLowerCase();
  });
  let expandedCard = {
    flex: isExpanded ? 0 : 1
  }
  let expandedSection = {
    height: isExpanded ? '70%' : '0%'
  }
  let expandedContainer = {
    minHeight: isExpanded ? '80%' : '30%'
  }
  return (
    <Container style={expandedContainer}>
      <Card style={expandedCard}>
        <HotelImageWrapper>
          <HotelImage
            src={`./assets/images/hotel_img${Math.floor(Math.random() * 8) + 1
              }.jpg`}
          />
        </HotelImageWrapper>
        <CenterSection onClick={() => { setExpanded(!isExpanded) }}>
          <HotelInfo>
            <HotelName>{HotelData.name}</HotelName>
            <HotelAddress>{HotelData.address}</HotelAddress>
            <HotelAddress>
              {HotelData.milesFromCenter} miles from city center
          </HotelAddress>
          </HotelInfo>
          {HotelData.amenities ? (
            <>
              <AmenitySectionTitle>Amenities:</AmenitySectionTitle>
              <Amenities>
                {amenities.slice(0, 4).map((perk) => {
                  return <Amenity>{perk}</Amenity>;
                })}
              </Amenities>
              {amenities.length > 5 ? (
                <AmenitiesInfo>And {amenities.length - 5} more...</AmenitiesInfo>
              ) : null}
            </>
          ) : null}
          {HotelData.rating ? (
            <Rating>
              {HotelData.rating}/5 {ratingStrings[HotelData.rating]}
            </Rating>
          ) : null}
        </CenterSection>
      </Card>
      <ExpandedSection style={expandedSection} >
        <Expansion bookingQuery={searchQuery} hotel={HotelData} isExpanded={isExpanded}></Expansion>
      </ExpandedSection>
    </Container>
  );
}
