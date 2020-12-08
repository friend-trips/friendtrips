import React from "react";
import styled from "styled-components";
import OneSuggestion from "./OneSuggestion.jsx";
// import ItinerarySuggestion from '../ItineraryBuilder/ItinerarySuggestion.jsx';

const SuggestionsContainer = styled.div`
  padding: 5px;
  height: 99%;
  overflow-y: scroll;
  width: 33%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SuggestionsHeader = styled.h2`
  font-family: "cerapro-bold",sans-serif;
`;

const Suggestions = (props) => {
  return (
  <SuggestionsContainer>
    <SuggestionsHeader>Flight Suggestions</SuggestionsHeader>
    {props.savedResults.length > 0
        ? props.savedResults.map((data, index) => (
            <OneSuggestion key={index} data={data}></OneSuggestion>
            // <ItinerarySuggestion key={index} data={data}></ItinerarySuggestion>
          ))
        : null}
  </SuggestionsContainer>
  )
};

export default Suggestions;