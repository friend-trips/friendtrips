import React from "react";
import Flight from "./Flight.jsx";
import styled from "styled-components";

const ResultsContainer = styled.div`
position: relative;
  padding: 5px;
  // height: 99%;
  overflow-y: scroll;
  width: 66%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchResults = (props) => {
  return (
    <ResultsContainer>
      {props.searchResults.length > 0
        ? props.searchResults.map((data, index) => (
            <Flight key={index} data={data}></Flight>
          ))
        : null}
    </ResultsContainer>
  );
};
export default SearchResults;