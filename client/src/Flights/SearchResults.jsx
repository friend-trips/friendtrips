import React from "react";
import Flight from "./Flight.jsx";
import styled from "styled-components";

const ResultsContainer = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  height: 100%;
  overflow-y: scroll;
  width: 66%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  width: 100%;
  padding: 10px;
  text-align: center;
  border-bottom: .5px solid black;
  font-family: "cerapro-bold",sans-serif;
`;
const Loader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 50%
`;

const SearchResults = (props) => {
  return (
    <ResultsContainer>
      <Header>
        Search Results
      </Header>
      {props.isLoading ? <Loader><img src={`./assets/loadingwheel.gif`}></img></Loader> : null}
      {props.searchResults.length > 0
        ? props.searchResults.map((data, index) => (
          <Flight key={index} data={data} getNewSavedResult={props.getNewSavedResult}></Flight>
        ))
        : null}
    </ResultsContainer>
  );
};
export default SearchResults;