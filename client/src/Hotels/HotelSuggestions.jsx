import React from "react";
import styled from "styled-components";
import OneSuggestion from "./OneSuggestion.jsx";

const Container = styled.div`
  padding: 5px;
  height: 97.5%;
  width: 36%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: .5px solid black;
`;

const Header = styled.header`
  display: flex;
  height: 40px;
  width: 100%;
  margin: 0;
  text-align: center;
  padding: 10px;
`;

export default function HotelSuggestions(props) {
  return (
    <Container>
      <Header>Hotel Suggestions</Header>
      {props.searchResults.length > 0
        ? props.searchResults.map((data, index) => (
            <OneSuggestion key={index} data={data}></OneSuggestion>
          ))
        : null}
    </Container>
  );
}
