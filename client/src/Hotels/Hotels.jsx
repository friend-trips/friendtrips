import React, { Component, useState, useEffect } from "react";
import SearchBar from "./SearchBar.jsx";
import HotelPageContent from "./HotelPageContent.jsx";
import styled from "styled-components";
import axios from "axios";

//entire screen
const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

<<<<<<< HEAD

=======
>>>>>>> staging
const Hotels = ({getSavedHotels, searchForHotels}) => {
  const [searchQuery, setSearchQuery] = useState({});

  useEffect(() => {
    getSavedHotels();
  }, [])

  const search = (query) => {
    setSearchQuery(query);
    searchForHotels(query);
  }

  return (
    <Wrapper>
      <SearchBar searchForHotels={search}/>
      <HotelPageContent
        searchQuery={searchQuery}
      />
    </Wrapper>
  );
}

<<<<<<< HEAD
export default Hotels;
=======
export default Hotels;
>>>>>>> staging
