import React, { Component, useState, useReducer } from "react";
import { DateRangeInput } from "@datepicker-react/styled";
import styled, { ThemeProvider } from "styled-components";
import moment from "moment";
import keys from "../../../config.js";

// import styles from './App.css';

var Amadeus = require("amadeus");
var amadeus = new Amadeus({
  clientId: keys.clientId,
  clientSecret: keys.clientSecret,
});

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  height: 20%;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  background-color: #f9f9f9;
`;

const StyledTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  // margin-left: 33em;
  // margin-top: 0.5em;
  // margin-bottom: 0.4em;
`;
//  -webkit-appearance: none;

const StyledLabelClass = styled.label`
  font-weight: 500;
`;

const StyledSelectClass = styled.select`
  border-radius: 13px;
  font-family: Montserrat, sans-serif;
  font-weight: 500;
  border-color: #fc5c65;
  border-width: 3px;
  background-color: #ffc8c4;
  color: #c8170a;
  text-align-last: center;
  margin-right: 3px;
`;
//  color: #c8170a;

const StyledLabelAdults = styled.label`
  border-radius: 13px;
  font-family: Montserrat, sans-serif;
  font-weight: 400;
  font-size: 13px;
  background-color: #fff9c5;
  color: #d6c313;

  text-align-last: center;
  width: 100px;
  display: inline-block;
  border: 3px solid #fdce54;
  margin-right: 3px;
`;

const StyledSelectAdults = styled.select`
  background-color: transparent;
  border: 0;
  color: #d6c313;
  text-align-last: right;
`;

const StyledLabelNonstop = styled.label`
  border-radius: 13px;
  font-family: Montserrat, sans-serif;
  font-weight: 400;
  font-size: 13px;
  background-color: #c6ffaf;
  color: #3ed602;
  text-align-last: center;
  width: 80px;
  margin-top: 0px;
  border: 3px solid #3ed602;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
`;

const StyledInput = styled.input`
  height: 44px;
  font-family: Montserrat, sans-serif;
  border-radius: 5px;
  font-weight: 500;
  border-color: #bababa;
  border-width: 1px;
  margin-right: 4px;
`;

const StyledSubmit = styled.input`
  border-width: 0px;
  border: none;
  background-color: #f7498e;
  color: #fff;
  height: 44px;
  width: 75px;
  border-radius: 5px;
  font-family: "cerapro-bold", sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  margin-left: 1em;
  margin-top: 0.05em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: center;

  position: relative;
  z-index: 2;
`;

const initialState = {
  startDate: null,
  endDate: null,
  focusedInput: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "focusChange":
      console.log("got here!!!!");
      return { ...state, focusedInput: action.payload };
    case "dateChange":
      return action.payload;
    default:
      throw new Error();
  }
}

function FlightForm({ displaySearchFeed }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [seatClass, setSeatClass] = useState("ECONOMY");
  const [adults, setAdults] = useState("1");
  const [nonstop, setNonstop] = useState(true);
  const [focusedCalendar, setFocusedCalendar] = useState(null);
  const [flights, setFlights] = useState([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  // const [test, setTest] = useState(false);

  const setDates = (data) => {
    setStartDate(data.startDate);
    setEndDate(data.endDate);
  };
  const handleChange = (field, event) => {
    console.log("handlechange", field);
    switch (field) {
      case "from":
        return setFrom(event.target.value);
      case "to":
        return setTo(event.target.value);
      case "seatClass":
        return setSeatClass(event.target.value);
      case "adults":
        return setAdults(event.target.value);
      case "nonstop":
        return setNonstop(event.target.value);
      default:
        return;
    }
  };

  const handleCheck = () => {
    setNonstop(!nonstop);
  };

  let flightDictionary = {};

  const filterData = (array) => {
    function changeTime(timeString) {
      if (timeString.slice(0, 2) > 12) {
        let twelveHour = timeString.slice(0, 2) % 12;
        return twelveHour.toString().concat(timeString.slice(2)).concat(" pm");
      } else if (timeString[0] === "0") {
        return timeString.slice(1).concat(" am");
      } else {
        return timeString.concat(" am");
      }
    }

    function formatDate(str) {
      let dateArr = str.split("-");
      dateArr = dateArr.map((date) => {
        let MDYArr = date.split("");
        if (MDYArr[0] === "0") MDYArr.shift();
        return MDYArr.join("");
      });
      return dateArr.join("/");
    }

    return array.map((result) => {
      let filteredResult = {
        id: result.id,
        bookableSeats: result.numberOfBookableSeats,
        totalPrice: Math.floor(result.price.grandTotal),

        outgoingDuration: `${result.itineraries[0].segments[0].duration
          .slice(2, 5)
          .toLowerCase()} ${result.itineraries[0].segments[0].duration
          .slice(5)
          .toLowerCase()}`,
        outgoingArrivalAirport:
          result.itineraries[0].segments[0].arrival.iataCode,
        outgoingArrivalTime: changeTime(
          result.itineraries[0].segments[0].arrival.at.slice(11, 16)
        ),
        // outgoingArrivalDate: result.itineraries[0].segments[0].arrival.at.slice(0, 10),
        outgoingDepartureAirport:
          result.itineraries[0].segments[0].departure.iataCode,
        outgoingDepartureTime: changeTime(
          result.itineraries[0].segments[0].departure.at.slice(11, 16)
        ),
        outgoingDepartureDate: formatDate(
          `${result.itineraries[0].segments[0].departure.at.slice(
            5,
            10
          )}-${result.itineraries[0].segments[0].departure.at.slice(0, 4)}`
        ),
        outgoingFlightNumber: result.itineraries[0].segments[0].number,
        outgoingNumberOfStops: result.itineraries[0].segments[0].numberOfStops,
        outgoingCarrierCode:
          flightDictionary[result.itineraries[0].segments[0].carrierCode],
        outgoingAbbreviatedCarrierCode:
          result.itineraries[0].segments[0].carrierCode,
        outgoingOperatingCarrierCode:
          result.itineraries[0].segments[0].operating.carrierCode,
        outgoingClass: result.travelerPricings[0].fareDetailsBySegment[0].cabin,

        returnDuration: `${result.itineraries[1].segments[0].duration
          .slice(2, 5)
          .toLowerCase()} ${result.itineraries[1].segments[0].duration
          .slice(5)
          .toLowerCase()}`,
        returnArrivalAirport:
          result.itineraries[1].segments[0].arrival.iataCode,
        returnArrivalTime: changeTime(
          result.itineraries[1].segments[0].arrival.at.slice(11, 16)
        ),
        // returnArrivalDate: result.itineraries[1].segments[0].arrival.at.slice(0, 10),
        returnDepartureAirport:
          result.itineraries[1].segments[0].departure.iataCode,
        returnDepartureTime: changeTime(
          result.itineraries[1].segments[0].departure.at.slice(11, 16)
        ),
        returnDepartureDate: formatDate(
          `${result.itineraries[1].segments[0].departure.at.slice(
            5,
            10
          )}-${result.itineraries[1].segments[0].departure.at.slice(0, 4)}`
        ),
        returnFlightNumber: result.itineraries[1].segments[0].number,
        returnNumberOfStops: result.itineraries[1].segments[0].numberOfStops,
        returnCarrierCode:
          flightDictionary[result.itineraries[1].segments[0].carrierCode],
        returnAbbreviatedCarrierCode:
          result.itineraries[1].segments[0].carrierCode,
        returnOperatingCarrierCode:
          result.itineraries[1].segments[0].operating.carrierCode,
        returnClass: result.travelerPricings[0].fareDetailsBySegment[1].cabin,
        outgoingAbbreviatedCarrierCode:
          result.itineraries[0].segments[0].carrierCode,
        returnAbbreviatedCarrierCode:
          result.itineraries[1].segments[0].carrierCode,
      };
      return filteredResult;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let startingDate = moment(startDate).format("YYYY-MM-DD");
    let endingDate = moment(endDate).format("YYYY-MM-DD");

    amadeus.shopping.flightOffersSearch
      .get({
        originLocationCode: to,
        destinationLocationCode: from,
        departureDate: startingDate,
        returnDate: endingDate,
        adults: adults,
        travelClass: seatClass,
        nonStop: nonstop,
        // nonStop: false,
        currencyCode: "USD",
        max: 25,
      })
      .then(function (response) {
        console.log("response", response.data);
        flightDictionary = response.result.dictionaries.carriers;
        displaySearchFeed(filterData(response.data));
      })
      .catch(function (response) {
        console.error(response);
      });
  };

  return (
    <Container>
      <StyledTopRow>
        <StyledLabelClass>
          <StyledSelectClass
            value={seatClass}
            name="seatClass"
            onChange={(e) => {
              handleChange("seatClass", e);
            }}
          >
            <option value="ECONOMY">Economy</option>
            <option value="PREMIUM_ECONOMY">Premium Economy</option>
            <option value="BUSINESS">Business</option>
            <option value="FIRST">First</option>
          </StyledSelectClass>
        </StyledLabelClass>
        <StyledLabelAdults>
          Adults
          <StyledSelectAdults
            type="number"
            value={adults}
            name="adults"
            onChange={(e) => {
              handleChange("adults", e);
            }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </StyledSelectAdults>
        </StyledLabelAdults>
        <StyledLabelNonstop>
          Nonstop
          <input
            type="checkbox"
            id="Nonstop"
            name="Nonstop"
            onChange={(e) => {
              handleChange("nonstop", e);
            }}
            defaultChecked={nonstop}
          />
        </StyledLabelNonstop>
      </StyledTopRow>
      <Form onSubmit={handleSubmit}>
        <label>
          <StyledInput
            type="text"
            placeholder="From"
            name="from"
            value={from}
            onChange={(e) => {
              handleChange("from", e);
            }}
          />
        </label>
        <label>
          <StyledInput
            type="text"
            placeholder="To"
            name="to"
            value={to}
            onChange={(e) => {
              handleChange("to", e);
            }}
          />
        </label>
        <DateRangeInput
          className="datePicker"
          onDatesChange={(data) => {
            setDates(data);
            dispatch({ type: "dateChange", payload: data });
          }}
          onFocusChange={(focusedInput) =>
            dispatch({ type: "focusChange", payload: focusedInput })
          }
          startDate={startDate} // Date or null
          endDate={endDate} // Date or null
          focusedInput={state.focusedInput} // START_DATE, END_DATE or null
          style="border-width: 100px;"
        />

        <StyledSubmit className="hi" type="submit" value="Search" />
      </Form>
    </Container>
  );
}

export default FlightForm;
