import React from "react";
import FlightForm from "./FlightForm.jsx";
import SearchResults from "./SearchResults.jsx";
import Suggestions from "./Suggestions.jsx";
import styled from "styled-components";

//entire screen
const Container = styled.div`
  height: 99%;
  width: 99%;
  position: absolute;
  padding: .5%;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-direction: column;
`
const Content = styled.div`
  position: relative;
  border: solid 3px;
  display: flex;
  flex-grow: 1;
  max-height: 82%;
  width: 100%;
  justify-content: space-between;
`;
//^^ height will control size of the bottom section
// form height and content should add up to equal 1--%

const PreSearchResults = styled.div`
  position:relative;
  border: solid 1px;
  height: 100%;
  width: 66%;
  float: left;
`;

class Flights extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
    };

    this.displaySearchFeed = this.displaySearchFeed.bind(this);
  }

  displaySearchFeed(data) {
    this.setState({
      searchResults: data,
    });
  }

  render() {
    return (
      <Container>
        <FlightForm displaySearchFeed={this.displaySearchFeed} />
        <Content>
          {this.state.searchResults.length > 0 ? (
            <SearchResults searchResults={this.state.searchResults} />
          ) : <PreSearchResults />}
          <Suggestions />
        </Content>
      </Container>
    );
  }
}

export default Flights;
