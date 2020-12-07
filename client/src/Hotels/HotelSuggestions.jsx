import React from "react";
import styled from "styled-components";
import OneSuggestion from "./OneSuggestion.jsx";

const Container = styled.div`
  padding: 5px;
  height: 75%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: .5px solid black;
`;

export default function HotelSuggestions(props) {
  return (
    <Container>
      <div>Hotel Suggestions</div>
      {props.searchResults.length > 0
        ? props.searchResults.map((data, index) => (
            <OneSuggestion key={index} data={data}></OneSuggestion>
          ))
        : null}
    </Container>
  );
}
