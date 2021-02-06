import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import axios from 'axios'

const Container = styled.div`
  position: relative;
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 4px;
`;
const Form = styled.form`
  margin: 0;
  padding: 0;
  width: 100%;
  position: relative;
`;
const Input = styled.input`
  height: 44px;
  font-family: Montserrat, sans-serif;
  border-radius: 5px;
  font-weight: 500;
  border-color: #bababa;
  border-width: 1px;
  width: 100%;
  margin: 0;
  padding-left: 5px;
`;
const CityCodes = styled.ul`
  position: relative;
  top: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  width: 100%;
`;
const City = styled.li`
  border: .5px solid grey;
  font-size: .9em;
  width: 100%;
  background-color: white;

  &: hover {
    border: 2px solid black;
    background-color: lightgrey;
  }
`;
const Info = styled.p`
  font-size: .5em;
  margin: 0;
`;

//TODO: add switch (or pass a prop) to allow user to pick between domestic and international city search
const CityCodeSearch = ({ setDestination, placeholderText }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [index, setIndex] = useState(null);
  const [cityCode, setCityCode] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  // https://morning-bayou-59969.herokuapp.com/api/amadeus/city_code/?keyword=San Francisco&subType=CITY

  useEffect(() => {
    axios.get(`https://morning-bayou-59969.herokuapp.com/api/amadeus/city_code/?keyword=${query}&subType=CITY`)
      .then(({data}) => {
        setSearchResults(data);
      })
      .catch((err) => {
        console.log(err)
        setSearchResults([]);
      })
        .then((res) => {
          let cities = res.data.map((row) => {
            return {
              name: row.name,
              cityCode: row.iataCode
            }
          })
          setSearchResults(cities);
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [query]);

  const makeSelection = (city) => {
    console.log('makeSelection', city)
    setCityCode(city.cityCode);
    setQuery(city.name);
    setInputFocused(false);
    // send city code back up to parent if that's how we are still doing it
    setDestination(city.cityCode);
  }

  const handleKeyPress = (event) => {
    if (!inputFocused && event.key !== 'Tab') {
      setInputFocused(true);
    }
    //check for reserved keys
    if (event.key === 'ArrowDown') {
      if (index === null) {
        setIndex(0);
        return;
      } else {
        setIndex(index + 1)
      }
    } else if (event.key === 'ArrowUp') {
      if (index === null) {
        setIndex(0);
        return;
      } else {
        setIndex(index - 1)
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (!index) {
        setIndex(0);
      }
      makeSelection(searchResults[index]);
      setIndex(null);
    } else if (event.key === 'Backspace') {
      setQuery(query.slice(0, query.length - 1));
    }
  }

  return (
    <Container onFocus={() => setInputFocused(true)}
    //  onBlur={() => { setInputFocused(false) }}
    >
      <Form onSubmit={(e) => { e.preventDefault() }} onKeyDown={handleKeyPress} >
        <Input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value) }}
          placeholder={placeholderText || "Destination"}
        />
      </Form>
      <CityCodes >
        {inputFocused ?
          (query.length > 0) ?
            searchResults.map((city, i) => {
              let selectionStyle = { backgroundColor: (i === index) ? 'lightgrey' : 'inherit' };
              return (
                <City
                  onClick={() => { makeSelection(city) }} style={selectionStyle}
                >
                  {city.name}
                </City>)
            }) :
            <Info>Start Typing To Search For Cities</Info>
          :
          null}
      </CityCodes>
    </Container>
  );
};

export default CityCodeSearch;