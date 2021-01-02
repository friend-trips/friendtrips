import React from "react";
import styled from "styled-components";
import OneSuggestion from "./OneSuggestion.jsx";
// import ItinerarySuggestion from '../ItineraryBuilder/ItinerarySuggestion.jsx';

const SuggestionsContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
  width: 34%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 1px solid black;
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 45px;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  border-bottom: .5px solid black;
  font-family: "cerapro-bold",sans-serif;
`;

const SuggestionList = styled.div`
  height: 100%;
  width: 100%;
`;

const Suggestions = (props) => {
  return (
    <SuggestionsContainer>
      <Header>
        Flight Suggestions
      </Header>
      <SuggestionList>
      {props.savedResults.length > 0
        ? props.savedResults.map((data, index) => (
          <OneSuggestion key={index} data={data}></OneSuggestion>
        ))
        : null}
        </SuggestionList>
    </SuggestionsContainer>
  )
};

export default Suggestions;