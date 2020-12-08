import React from "react";
import Flight from "./Flight.jsx";
import styled from "styled-components";

const ResultsContainer = styled.div`
  padding: 5px;
  height: 99%;
  overflow-y: scroll;
  width: 66%;
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

const SearchResults = (props) => {
  return (
    <ResultsContainer>
      <Header>
        <SuggestionsHeader>Search Results</SuggestionsHeader>
      </Header>
      {props.searchResults.length > 0
        ? props.searchResults.map((data, index) => (
          <Flight key={index} data={data} getNewSavedResult={props.getNewSavedResult}></Flight>
        ))
        : null}
    </ResultsContainer>
  );
};
export default SearchResults;