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
const Header = styled.header`
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SuggestionsHeader = styled.h2`
  font-family: "cerapro-bold",sans-serif;
`;
const SuggestionList = styled.div`
  height: 100%;
  width: 98%;
`;

const Suggestions = (props) => {
  return (
    <SuggestionsContainer>
      <Header>
        <SuggestionsHeader>Flight Suggestions</SuggestionsHeader>
      </Header>
      <SuggestionList>
      {props.savedResults.length > 0
        ? props.savedResults.map((data, index) => (
<<<<<<< HEAD
          <OneSuggestion key={index} data={data}></OneSuggestion>
        ))
=======
            <OneSuggestion key={index} data={data}></OneSuggestion>
            // <ItinerarySuggestion key={index} data={data}></ItinerarySuggestion>
          ))
>>>>>>> d1b6260c13f563c46da244a4054b849dc29e48f2
        : null}
        </SuggestionList>
    </SuggestionsContainer>
  )
};

export default Suggestions;