import React from "react";
import styled from "styled-components";
import OneSuggestion from "./OneSuggestion.jsx";

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
          <OneSuggestion key={index} data={data}></OneSuggestion>
        ))
        : null}
        </SuggestionList>
    </SuggestionsContainer>
  )
};

export default Suggestions;