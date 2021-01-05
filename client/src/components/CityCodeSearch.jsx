import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { DomesticDestinations, IntlDestinations } from '../lib/CityCodes.js'

const Container = styled.div`
  position: relative;
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 4px;
`
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
// const SearchResults = styled.div``;
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

const CityCodeSearch = ({ setDestination }) => {
  const [query, setQuery] = useState('');
  const [destinationType, setDestinationType] = useState('domestic');
  const [searchResults, setSearchResults] = useState([]);
  const [index, setIndex] = useState(null);
  const [cityCode, setCityCode] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    let cityCodeList;
    if (destinationType === 'domestic') {
      cityCodeList = DomesticDestinations;
    } else if (destinationType === 'international') {
      cityCodeList = IntlDestinations;
    }
    setIndex(null);
    let newSearchResults = cityCodeList
      .sort((a, b) => {
        return scoreCandidate(query, a) - scoreCandidate(query, b);
      })
      .slice(0, 9);
    setSearchResults(newSearchResults);
  }, [query])

  const scoreCandidate = (word, target) => {
    //hamDist + indexOf(word) returns an integer which we can use in our sorting func -- the smaller the score, the better the match
    if (target.indexOf(word) === -1) {
      return Infinity;
    }
    let ham = 0;
    for (let i = 0; i <= word.length - 1; i++) {
      if (word[i] !== target[i]) {
        ham++;
      }
    }
    return ham + target.indexOf(word);
  }

  const makeSelection = (city) => {
    console.log('makeSelection', city)
    let codeStart = city.indexOf('(');
    let codeEnd = city.indexOf(')')
    let cityCode = city.slice(codeStart + 1, codeEnd);
    setCityCode(cityCode);
    setQuery(city);
    setInputFocused(false);
    // send city code back up to parent if that's how we are still doing it
    setDestination(cityCode);
  }

  const handleKeyPress = (event) => {
    if (!inputFocused && event.key !== 'Tab') {
      setInputFocused(true);
    }
    //check for reserved keys
    if (event.key === 'ArrowDown') {
      console.log('down')
      if (index === null) {
        setIndex(0);
        return;
      } else {
        setIndex(index + 1)
      }
    } else if (event.key === 'ArrowUp') {
      console.log('up')
      if (index === null) {
        setIndex(0);
        return;
      } else {
        setIndex(index - 1)
      }
    } else if (event.key === 'Enter') {
      console.log('enter', event.key);
      event.preventDefault();
      if (!index) {
        setIndex(0);
      }
      makeSelection(searchResults[index]);
      setIndex(null);
    } else if (event.key === 'Backspace') {
      console.log('backspace', event.key);
      setQuery(query.slice(0, query.length - 1));
    }
    //return;
  }

  return (
    <Container onFocus={() => setInputFocused(true)}
    //  onBlur={() => { setInputFocused(false) }}
    >
      <Form onSubmit={(e) => { e.preventDefault() }} onKeyDown={handleKeyPress} >
        <Input
          type="text"
          value={query}
          onChange={(e) => {setQuery(e.target.value)}}
        />
      </Form>
      {/* <SearchResults> */}
      <CityCodes >
        {inputFocused ?
          (query.length > 0) ?
            searchResults.map((city, i) => {
              let selectionStyle = { backgroundColor: (i === index) ? 'lightgrey' : 'inherit' };
              return (
                <City
                  onClick={() => { makeSelection(city) }} style={selectionStyle}
                >
                  {city}
                </City>)
            }) :
            <Info>Start Typing To Search For Cities</Info>
          :
          null}
      </CityCodes>
      {/* </SearchResults> */}
    </Container>
  );
};

export default CityCodeSearch;