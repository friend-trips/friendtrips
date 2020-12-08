import React, { Component, useState } from "react";
import { DateRangeInput } from "@datepicker-react/styled";
import styled from "styled-components";
import moment from "moment";

const Wrapper = styled.div`
  position: relative;
  margin-top: 2%;
  margin-bottom: 3%;
  max-height: 20%;
  /* border-color: black; */
  /* border-style: solid; */
  /* border-width: 4px; */
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.4%;
  position: relative;
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

export default function SearchBar(props) {
  const [cityCode, setCityCode] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [focusedCalendar, setFocusedCalendar] = useState(null);
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [adults, setAdults] = useState(1);

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
    let startingDate = moment(checkInDate).format("YYYY-MM-DD");
    let endingDate = moment(checkOutDate).format("YYYY-MM-DD");
    props.searchForHotels(
      cityCode,
      startingDate,
      endingDate,
      roomQuantity,
      adults
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
              }}
              onFocusChange={(focusedInput) => setFocusedCalendar(focusedInput)}
              startDate={checkInDate} // Date or null
              endDate={checkOutDate} // Date or null
              focusedInput={focusedCalendar} // START_DATE, END_DATE or null

            />
            <StyledSubmit type="submit" value="Search" />
          </StyledForm>
        </BottomRow>
      </Container>
    </Wrapper>
  );
}
