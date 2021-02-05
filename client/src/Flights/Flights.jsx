import React, {useEffect} from "react";
import FlightForm from "../Flights/containers/FlightFormContainer.js";
import SearchResults from "../Flights/containers/SearchResultsContainer.js";
//import SearchResults from "./SearchResults.jsx";
// import Suggestions from "./Suggestions.jsx";
import Suggestions from "../Flights/containers/SuggestionContainer.js";
import styled from "styled-components";
import axios from 'axios';
// import Itinerary from '../ItineraryBuilder/Itinerary.jsx';

//entire screen
const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 15px;
  background-color: #f9f9f9;
  overflow: hidden;
`
const Content = styled.div`
  position: relative;
  border-top: 1px solid black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  height: 80%;
  justify-content: space-between;
  background-color: #f9f9f9;
`;

const App = ({getSavedFlights}) => {

  useEffect(() => {
    getSavedFlights();
  }, [])

  return (
    <Container>
      <FlightForm />
      <Content>
        <SearchResults />
        <Suggestions />
      </Content>
    </Container>
  );
}

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       searchResults: [],
//       savedResults: [],
//       upvotes: [],
//       downvotes: [],
//       loading: false
//     };
//     console.log('constructed props', props)
//     this.displaySearchFeed = this.displaySearchFeed.bind(this);
//     this.getSavedResults = this.getSavedResults.bind(this);
//     this.getNewSavedResult = this.getNewSavedResult.bind(this);
//     this.displayLoadingWheel = this.displayLoadingWheel.bind(this);
//   }

//   displaySearchFeed(data) {
//     this.setState({
//       searchResults: data,
//       loading: false
//     });
//   }

//   displayLoadingWheel() {
//     this.setState({
//       loading: true
//     });
//   }

//   getNewSavedResult(result) {
//     let newSavedArray = [];
//     newSavedArray.push(result)
//     this.setState({ savedResults: [...this.state.savedResults, newSavedArray[0]] });
//   }

//   getSavedResults() {
//     axios.get(`https://morning-bayou-59969.herokuapp.com/flights/?trip_id=1`)

//       .then((data) => {
//         let savedArray = [];
//         console.log(data, "data.data")
//         for (let keys in data.data) {
//           savedArray.push(data.data[keys])
//         }
//         console.log("savedArray", savedArray);
//         let upvoteNames = [];
//         let downvoteNames = [];
//         for (var i = 0; i < savedArray.length; i++) {
//           upvoteNames.push(savedArray[i].meta.upvote_names);
//           downvoteNames.push(savedArray[i].meta.downvote_names);
//         }
//         this.setState({
//           savedResults: savedArray,
//           // upvotes: upvoteNames,
//           // downvotes: downvoteNames
//         })
//       })
//       .catch(console.log)
//   }

//   componentDidMount() {
//     // this.getSavedResults();
//     this.getSavedFlights();
//   }

//   render() {
//     return (
//       <Container>
//         <FlightForm displaySearchFeed={this.displaySearchFeed} displayLoadingWheel={this.displayLoadingWheel}/>
//         <Content>
//           <SearchResults searchResults={this.state.searchResults} getNewSavedResult={this.getNewSavedResult} isLoading={this.state.loading}/>
//           <Suggestions savedResults={this.state.savedResults} />
//         </Content>
//       </Container>
//     );
//   }
// }

export default App;
