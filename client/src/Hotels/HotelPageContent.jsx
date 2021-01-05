import React from "react";
import styled from "styled-components";
import HotelSearchResults from "./containers/HotelSearchResultsContainer.js";
import HotelSuggestions from "./containers/HotelSuggestionsContainer.js";

const ResultsContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
  height: 100%;
  width: 100%;
`;

export default function HotelPageContent(props) {
  return (
    <ResultsContainer>
      <HotelSearchResults searchQuery={props.searchQuery} />
      <HotelSuggestions />
    </ResultsContainer>
  );
}
