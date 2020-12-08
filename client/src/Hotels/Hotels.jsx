import React, { Component } from "react";
import SearchBar from "./SearchBar.jsx";
import HotelPageContent from "./HotelPageContent.jsx";
import styled from "styled-components";
// import "./App.css";
import moment from "moment";

//entire screen
const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 99%;
  width: 99%;
  padding: .5%;
  overflow-y: scroll
`;

var Amadeus = require("amadeus");
var amadeus = new Amadeus({
  clientId: "K6PZSGD27MzELXz7ZmiN1xpsRVgN4R4H",
  clientSecret: "oW4tFxsTbGApvklU",
});

const roomNumChoices = [1, 2, 3, 4, 5, 6];
const adultNumChoices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
// nightly price
const ROOM_PRICES = Array.from({ length: 40 }, () =>
  getRandomIntInclusive(44, 135)
);

// calculate the number of nights from checkInDate and checkOutDate (month is 0-indexed)
function calculateNumberOfNights(checkInDate, checkOutDate) {
  checkOutDate = checkOutDate.split("-").map((num) => Number(num));
  checkInDate = checkInDate.split("-").map((num) => Number(num));
  // month is 0-indexed
  checkOutDate[1] -= 1;
  checkInDate[1] -= 1;

  const checkOutNum = new Date(
    checkOutDate[0],
    checkOutDate[1],
    checkOutDate[2]
  );
  const checkInNum = new Date(checkInDate[0], checkInDate[1], checkInDate[2]);
  const difference = checkOutNum.getTime() - checkInNum.getTime();
  return difference / (1000 * 60 * 60 * 24);
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      cityCode: "",
      checkInDate: "",
      checkOutDate: "",
      roomQuantity: 0,
      adults: 0,
    };
    this.setSearchFeed = this.setSearchFeed.bind(this);
    this.filterData = this.filterData.bind(this);
    this.searchForHotels = this.searchForHotels.bind(this);
  }

  setSearchFeed(data) {
    this.setState({
      searchResults: data,
    });
  }

  // get only the data we want from the api result
  filterData(arr) {
    const newArr = arr.map((result) => {
      const filteredResult = {};
      // store the hotelId
      filteredResult["hotelId"] = result["hotel"]["hotelId"];
      // store the name
      filteredResult["name"] = result["hotel"]["name"];
      // store the location
      const postalCode = result["hotel"]["address"]["postalCode"]
        ? " " + result["hotel"]["address"]["postalCode"]
        : "";
      const address =
        result["hotel"]["address"]["lines"][0] +
        " " +
        result["hotel"]["address"]["cityName"] +
        " " +
        result["hotel"]["address"]["countryCode"] +
        postalCode;
      filteredResult["address"] = address;
      filteredResult["rating"] = result["hotel"]["rating"];
      // store the hotel amenities
      filteredResult["amenities"] = result["hotel"]["amenities"];
      // store the hotel total cost (roomQuantity * nightly price * number of Nights )
      filteredResult["Price"] = Math.floor(
        Number(
          this.state.roomQuantity *
            ROOM_PRICES[Math.floor(Math.random() * ROOM_PRICES.length)] *
            calculateNumberOfNights(
              this.state.checkInDate,
              this.state.checkOutDate
            )
        )
      );
      filteredResult["numOfNights"] = calculateNumberOfNights(this.state.checkInDate, this.state.checkOutDate);
      filteredResult["milesFromCenter"] = result["hotel"]["hotelDistance"]["distance"];
      return filteredResult;
    });

    console.log("this is the new arr", newArr);
    return newArr;
  }

  searchForHotels(cityCode, checkInDate, checkOutDate, roomQuantity, adults) {
    event.preventDefault();
    const filterData = this.filterData;
    const setSearchFeed = this.setSearchFeed;
    this.setState({ cityCode: cityCode });
    this.setState({ checkInDate: checkInDate });
    this.setState({ checkOutDate: checkOutDate });
    this.setState({ roomQuantity: roomQuantity });
    this.setState({ adults: adults });

    // for the demo, we are not sending the roomQuantity or adult fields to the api since most hotels do not have offers during this time.
    // instead, we will calculate the price based on the searchBar inputs and calculate price manually
    console.log(cityCode);
    console.log(checkInDate);
    console.log(checkOutDate);
    amadeus.shopping.hotelOffers
      .get({
        cityCode: cityCode,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        radius: "15",
        radiusUnit: "MILE",
        includeClosed: "true",
        currency: "USD"
      })
      .then(function (response) {
        console.log(response.data);
        setSearchFeed(filterData(response.data));
      })
      .catch(function (response) {
        console.log(response);
      });
  }

  render() {
    return (
      <Wrapper>
        <SearchBar searchForHotels={this.searchForHotels} />
        <HotelPageContent searchResults={this.state.searchResults} cityCode={this.state.cityCode} checkInDate={this.state.checkInDate} checkOutDate={this.state.checkOutDate} roomQuantity={this.state.roomQuantity} adults={this.state.adults}/>
      </Wrapper>
    );
  }
}

// cityCode: "",
// checkInDate: "",
// checkOutDate: "",
// roomQuantity: 0,
// adults: 0,
