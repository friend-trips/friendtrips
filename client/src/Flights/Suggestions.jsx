import React from "react";
import styled from "styled-components";

const SuggestionsContainer = styled.div`
  border: solid 1px;
  border-color: red;
  height: 87%;
  width: 30%;
  left: 69%;
  position: absolute;
  font-family: helvetica;
  text-align: center;
`;

const Suggestions = (props) => {
  return (
  <SuggestionsContainer>
    <h2>Flight Suggestions</h2>
  </SuggestionsContainer>
  )
};

export default Suggestions;