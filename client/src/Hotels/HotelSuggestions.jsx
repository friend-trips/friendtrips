import React from "react";
import styled from "styled-components";
import OneSuggestion from "./OneSuggestion.jsx";

const Container = styled.div`
  // padding: 5px;
  height: 100%;
  width: 36%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: .5px solid black;
  position: relative;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  width: 100%;
  // margin: 10px;
  padding: 10px;
  text-align: center;
  border-bottom: .5px solid black;
`;


export default function HotelSuggestions(props) {
  return (
    <Container>
      <Header>Hotel Suggestions</Header>
      {props.savedResults.length > 0
        ? props.savedResults.map((data, index) => (
            <OneSuggestion key={index} data={data}></OneSuggestion>
          ))
        : null}
    </Container>
  );
}
