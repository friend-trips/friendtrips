import React, { Component, useState, useReducer } from "react";
import { DateRangeInput } from "@datepicker-react/styled";
import styled from "styled-components";
import moment from "moment";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  height: 20%;
  position: relative;
  max-height: 20%;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid grey;
  width: 100%;
  height: 100%;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 50%;
`;

const StyledLabelClass = styled.label`
  border-radius: 13px;
  font-family: Montserrat, sans-serif;
  font-weight: 500;
  font-size: 13px;
  background-color: #fff9c5;
  color: #c8170a;
  text-align-last: center;
  width: 100px;
  display: inline-block;
  border: 3px solid #fdce54;
  background-color: #ffc8c4;
  border-color: #fc5c65;
  margin-right: 3px;
`;

const StyledRoomSelect = styled.select`
  border-radius: 13px;
  font-family: Montserrat, sans-serif;
  font-weight: 500;
  background-color: #ffc8c4;
  color: #c8170a;
  text-align-last: center;
  margin-right: 3px;
  border: 0;
`;

const StyledAdultsLabel = styled.label`
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

const StyledAdultsSelect = styled.select`
  border-radius: 13px;
  font-family: Montserrat, sans-serif;
  font-weight: 500;
  background-color: #fff9c5;
  color: #d6c313;
  text-align-last: center;
  margin-right: 3px;
  border: 0;
`;

const BottomRow = styled.div`
  display: flex;
  position: relative;
  height: 50%;
`;

const StyledForm = styled.form`
  display: flex;
  z-index: 2;
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

const roomNumChoices = [2, 3, 4, 5, 6];
const adultNumChoices = [2, 3, 4, 5, 6, 7, 8, 9, 10];

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

export default function SearchBar(props) {
  const [cityCode, setCityCode] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [focusedCalendar, setFocusedCalendar] = useState(null);
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [adults, setAdults] = useState(1);
  const [state, dispatch] = useReducer(reducer, initialState);

  const setDates = (data) => {
    console.log(data);
    setCheckInDate(data.startDate);
    setCheckOutDate(data.endDate);
  };

  const handleChange = (field, event) => {
    switch (field) {
      case "cityCode":
        return setCityCode(event.target.value);
      case "checkInDate":
        return setCheckInDate(event.target.value);
      case "checkOutDate":
        return setCheckOutDate(event.target.value);
      case "roomQuantity":
        return setRoomQuantity(event.target.value);
      case "adults":
        return setAdults(event.target.value);
      default:
        return;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // props.displayLoadingWheel();
    let startingDate = moment(checkInDate).format("YYYY-MM-DD");
    let endingDate = moment(checkOutDate).format("YYYY-MM-DD");
    props.searchForHotels(
      {cityCode: cityCode,
      checkInDate: startingDate,
      checkOutDate: endingDate,
      roomQuantity: roomQuantity,
      adults: adults}
    );
  };

  return (
    <Wrapper>
      <Container>
        <TopRow>
          <StyledLabelClass>
            Rooms
            <StyledRoomSelect
              name="roomQuantity"
              value={roomQuantity}
              onChange={(e) => {
                handleChange("roomQuantity", e);
              }}
            >
              <option>1</option>
              {roomNumChoices.map((quantity) => (
                <option key={quantity} value={quantity}>
                  {quantity}
                </option>
              ))}
            </StyledRoomSelect>
          </StyledLabelClass>
          <StyledAdultsLabel>
            Adults
            <StyledAdultsSelect
              name="adults"
              value={adults}
              onChange={(e) => {
                handleChange("adults", e);
              }}
            >
              <option>1</option>
              {adultNumChoices.map((quantity) => (
                <option key={quantity} value={quantity}>
                  {quantity}
                </option>
              ))}
            </StyledAdultsSelect>
          </StyledAdultsLabel>
        </TopRow>
        <BottomRow>
          <StyledForm onSubmit={handleSubmit}>
            <label>
              <StyledInput
                name="cityCode"
                type="text"
                value={cityCode}
                onChange={(e) => {
                  handleChange("cityCode", e);
                }}
                placeholder={"Destination"}
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
              startDate={checkInDate} // Date or null
              endDate={checkOutDate} // Date or null
              focusedInput={state.focusedInput} // START_DATE, END_DATE or null
            />
            <StyledSubmit type="submit" value="Search" />
          </StyledForm>
        </BottomRow>
      </Container>
    </Wrapper>
  );
}
