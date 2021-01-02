import React, { Component, useState, useEffect } from "react";
import SearchBar from "./SearchBar.jsx";
import HotelPageContent from "./HotelPageContent.jsx";
import styled from "styled-components";
import axios from "axios";
import filterData from '../lib/hotelResultParser.js'

//entire screen
const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

var Amadeus = require("amadeus");
var amadeus = new Amadeus({
  clientId: "K6PZSGD27MzELXz7ZmiN1xpsRVgN4R4H",
  clientSecret: "oW4tFxsTbGApvklU",
});


const Hotels = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [savedResults, setSavedResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({});

  useEffect(() => {
    getSavedResults();
  }, [])

  const searchForHotels = (query) => {
    setSearchQuery(query);
    setLoading(true);
    amadeus.shopping.hotelOffers
      .get({
        cityCode: query.cityCode,
        checkInDate: query.checkInDate,
        checkOutDate: query.checkOutDate,
        radius: "15",
        radiusUnit: "MILE",
        includeClosed: "true",
        currency: "USD",
      })
      .then((response) => {
        setSearchResults(filterData(response.data));
        setLoading(false);
      })
      .catch((response) => {
        console.log(response);
      });
  }

  const getSavedResults = () => {
    axios
      .get("http://morning-bayou-59969.herokuapp.com/hotels/?trip_id=1")
      .then(({ data }) => {
        setSavedResults(Object.values(data))
      })
      .catch(console.log);
  }

  return (
    <Wrapper>
      <SearchBar searchForHotels={searchForHotels}/>
      <HotelPageContent
        searchResults={searchResults}
        savedResults={savedResults}
        searchQuery={searchQuery}
        isLoading={loading}
      />
    </Wrapper>
  );
}

export default Hotels;
// export default class App extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       searchResults: [],
//       cityCode: "",
//       checkInDate: "",
//       checkOutDate: "",
//       roomQuantity: 1,
//       adults: 1,
//       savedResults: [],
//       loading: false
//     };
//     this.setSearchFeed = this.setSearchFeed.bind(this);
//     this.filterData = this.filterData.bind(this);
//     this.searchForHotels = this.searchForHotels.bind(this);
//     this.getSavedResults = this.getSavedResults.bind(this);
//     this.getNewSavedResult = this.getNewSavedResult.bind(this);
//     this.displayLoadingWheel = this.displayLoadingWheel.bind(this);
//   }

//   setSearchFeed(data) {
//     this.setState({
//       searchResults: data,
//       loading: false
//     });
//   }

//   displayLoadingWheel() {
//     this.setState({
//       loading: true
//     });
//   }

//   // get only the data we want from the api result
//   filterData(arr) {
//     const newArr = arr.map((result) => {
//       const filteredResult = {};
//       // store the hotelId
//       filteredResult["hotelId"] = result["hotel"]["hotelId"];
//       // store the name
//       filteredResult["name"] = result["hotel"]["name"];
//       // store the location
//       const postalCode = result["hotel"]["address"]["postalCode"]
//         ? " " + result["hotel"]["address"]["postalCode"]
//         : "";
//       const address =
//         result["hotel"]["address"]["lines"][0] +
//         " " +
//         result["hotel"]["address"]["cityName"] +
//         " " +
//         result["hotel"]["address"]["countryCode"] +
//         postalCode;
//       filteredResult["address"] = address;
//       filteredResult["rating"] = result["hotel"]["rating"];
//       // store the hotel amenities
//       filteredResult["amenities"] = result["hotel"]["amenities"];
//       // store the hotel total cost (roomQuantity * nightly price * number of Nights )
//       filteredResult["Price"] = Math.floor(
//         Number(
//           this.state.roomQuantity *
//           ROOM_PRICES[Math.floor(Math.random() * ROOM_PRICES.length)] *
//           calculateNumberOfNights(
//             this.state.checkInDate,
//             this.state.checkOutDate
//           )
//         )
//       );
//       filteredResult["numOfNights"] = calculateNumberOfNights(
//         this.state.checkInDate,
//         this.state.checkOutDate
//       );
//       filteredResult["milesFromCenter"] =
//         result["hotel"]["hotelDistance"]["distance"];
//       return filteredResult;
//     });

//     console.log("this is the new arr", newArr);
//     return newArr;
//   }

//   searchForHotels(cityCode, checkInDate, checkOutDate, roomQuantity, adults) {
//     event.preventDefault();
//     const filterData = this.filterData;
//     const setSearchFeed = this.setSearchFeed;
//     this.setState({ cityCode: cityCode });
//     this.setState({ checkInDate: checkInDate });
//     this.setState({ checkOutDate: checkOutDate });
//     this.setState({ roomQuantity: roomQuantity });
//     this.setState({ adults: adults });

//     // the below are old comments. we are sending roomQuantity and adult fields to the api
//     // for the demo, we are not sending the roomQuantity or adult fields to the api since most hotels do not have offers during this time.
//     // instead, we will calculate the price based on the searchBar inputs and calculate price manually
//     amadeus.shopping.hotelOffers
//       .get({
//         cityCode: cityCode,
//         checkInDate: checkInDate,
//         checkOutDate: checkOutDate,
//         radius: "15",
//         radiusUnit: "MILE",
//         includeClosed: "true",
//         currency: "USD",
//       })
//       .then(function (response) {
//         console.log(response.data);
//         setSearchFeed(filterData(response.data));
//       })
//       .catch(function (response) {
//         console.log(response);
//       });
//   }

//   getNewSavedResult(result) {
//     let newSavedArray = [];
//     newSavedArray.push(result);
//     this.setState({
//       savedResults: [...this.state.savedResults, newSavedArray[0]],
//     });
//   }

//   getSavedResults() {
//     axios
//       .get("http://morning-bayou-59969.herokuapp.com/hotels/?trip_id=1")
//       .then(({ data }) => {
//         let savedArray = [];
//         console.log("data ", data);
//         for (let keys in data) {
//           savedArray.push(data[keys]);
//         }
//         console.log("savedArray", savedArray);
//         this.setState({
//           savedResults: savedArray,
//         });
//       })
//       .catch(console.log);
//   }

//   componentDidMount() {
//     this.getSavedResults();
//   }

//   render() {
//     return (
//       <Wrapper>
//         <SearchBar searchForHotels={this.searchForHotels} displayLoadingWheel={this.displayLoadingWheel} />
//         <HotelPageContent
//           searchResults={this.state.searchResults}
//           savedResults={this.state.savedResults}
//           cityCode={this.state.cityCode}
//           checkInDate={this.state.checkInDate}
//           checkOutDate={this.state.checkOutDate}
//           roomQuantity={this.state.roomQuantity}
//           adults={this.state.adults}
//           getNewSavedResult={this.getNewSavedResult} isLoading={this.state.loading}
//         />
//       </Wrapper>
//     );
//   }
// }

// cityCode: "",
// checkInDate: "",
// checkOutDate: "",
// roomQuantity: 0,
// adults: 0,
