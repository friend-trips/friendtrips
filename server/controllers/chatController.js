const axios = require('axios');

class ChatController {
  //storage objects for records from the db
  constructor() {
    this.messages = {};
    this.comments = {};
    this.flights = {};
    this.hotels = {};
    this.feed = {};
  }

  async initialize(trip_id) {
    console.log('initialize with trip_id: ', trip_id)
    //get chat messages from db
    let messages = await axios.get(`https://morning-bayou-59969.herokuapp.com/messages/?trip_id=${trip_id}`)
      .then((queryResult) => {
        let queriedMessages = queryResult.data;
        for (let i = 0; i <= queriedMessages.length - 1; i++) {
          if (!this.messages[queriedMessages[i].message_id]) {
            let msgToReturn = queriedMessages[i];
            msgToReturn.type = 'message';
            msgToReturn.comments = [];
            this.messages[queriedMessages[i].message_id] = msgToReturn
          }
        }
        console.log('messageCount', Object.keys(this.messages).length)
        return this.messages;
      })
      .catch((err) => {
        console.log('error getting messages from database');
        return {};
      });
    //get comments from db
    let comments = await axios.get(`https://morning-bayou-59969.herokuapp.com/comments/?trip_id=${trip_id}`)
      .then((queryResult) => {
        let comments = queryResult.data
        for (let i = 0; i <= comments.length - 1; i++) {
          if (!this.comments[comments[i].comment_id]) {
            this.comments[comments[i].comment_id] = comments[i];
          }
        }
        console.log('commentCount', Object.keys(this.comments).length)
        return this.comments;
      })
      .catch((err) => {
        console.log('error getting comments from database')
        return {}
      })
    //get flights from db
    let flights = await axios.get(`https://morning-bayou-59969.herokuapp.com/flights/?trip_id=${trip_id}`)
      .then((result) => {
        let flightList = result.data;
        for (let id in flightList) {
          if (!this.flights[id]) {
            flightList[id].type = 'flight'
            flightList[id].timestamp = flightList[id].meta.time_created;
            this.flights[id] = flightList[id];
          }
        }
        console.log('flightCount', Object.keys(this.flights).length)
        return this.flights;
      })
      .catch((err) => {
        console.log('error getting flights from database', err)
        return {};
      })
    //get flights from db
    let hotels = await axios.get(`https://morning-bayou-59969.herokuapp.com/hotels/?trip_id=${trip_id}`)
      .then((result) => {
        let hotelList = result.data;
        for (let id in hotelList) {
          if (!this.hotels[id]) {
            hotelList[id].type = 'hotel'
            hotelList[id].timestamp = hotelList[id].time_created;
            this.hotels[id] = hotelList[id];
          }
        }
        console.log('hotelCount', Object.keys(this.hotels).length)
        return this.hotels;
      })
      .catch((err) => {
        console.log('error getting flights from database', err)
        return {};
      })
    console.log('Merging Records..')
    this.mergeComments();
    this.createFeed();
  };

  mergeComments() {
    for (let id in this.comments) {
      let currentComment = this.comments[id];
      if (!this.messages[currentComment.message_id].comments.includes(currentComment)) {
        this.messages[currentComment.message_id].comments.push(currentComment);
      }
    }
    return;
  }

  createFeed() {
    let flights = Object.values(this.flights).sort((a, b) => a.meta.time_created - b.meta.time_created)
    let hotels = Object.values(this.hotels).sort((a, b) => a.time_created - b.time_created)
    let messages = Object.values(this.messages).sort((a, b) => a.timestamp - b.timestamp)

    let res = [messages, flights, hotels]
      .flat()
      .sort((a, b) => a.timestamp - b.timestamp);

    res.forEach((element) => {
      // console.log(element.timestamp)
      if (this.feed[element.timestamp] !== undefined) {
        let newTime = (Number(element.timestamp) + 1).toString();
        while (this.feed[newTime] !== undefined) {
          newTime = (Number(newTime) + 1).toString()
        }
        this.feed[newTime] = element;
      } else {
        this.feed[element.timestamp] = element;
      }
    });
    console.log('...records merged');
  }

  mergeFlights() {
    let copyOfFlights = Object.values(this.flights).sort((a, b) => {
      return (Number(a.meta.time_created) - Number(b.meta.time_created))
    });
    let copyOfMessages = Object.values(this.messages).sort((a, b) => {
      return (Number(a.timestamp) - Number(b.timestamp))
    });
    let flightsPointer = 0;
    let messagesPointer = 0;
    while (flightsPointer < copyOfFlights.length && messagesPointer < copyOfMessages.length) {
      // add messages and flights to feed in order until you run out of either messages or flights
      if (copyOfFlights[flightsPointer].meta.time_created < copyOfMessages[messagesPointer].timestamp) {
        let currentFlight = copyOfFlights[flightsPointer];
        currentFlight.type = 'flight'
        this.feed[currentFlight.meta.time_created] = currentFlight;
        flightsPointer++;
      } else if (copyOfFlights[flightsPointer].meta.time_created > copyOfMessages[messagesPointer].timestamp) {
        let currentMessage = copyOfMessages[messagesPointer];
        currentMessage.type = 'message'
        this.feed[currentMessage.timestamp] = currentMessage;
        messagesPointer++;
      } else {
        let currentMessage = copyOfMessages[messagesPointer];
        currentMessage.type = 'message'
        this.feed[currentMessage.timestamp + 1] = currentMessage;
        messagesPointer++;
      }
    }
    //adds the remaining flights or messages to the feed -- only one of these loops will run because the start point (pointer) of the other loop will already be at the end
    for (let i = messagesPointer; i <= copyOfMessages.length - 1; i++) {
      let currentMessage = copyOfMessages[messagesPointer];
      currentMessage.type = 'message'
      if (!this.feed[currentMessage.timestamp]) {
        this.feed[currentMessage.timestamp] = currentMessage;
      } else {
        this.feed[currentMessage.timestamp + 1] = currentMessage;
      }
    }
    for (let i = flightsPointer; i <= copyOfFlights.length - 1; i++) {
      let currentFlight = copyOfFlights[flightsPointer];
      currentFlight.type = 'flight'
      if (!this.feed[currentFlight.timestamp]) {
        this.feed[currentFlight.timestamp] = currentFlight;
      } else {
        this.feed[currentFlight.timestamp + 1] = currentFlight;
      }
    }
    console.log('finished merging records')
    return;
  }

  addToFeed(item, type) {
    if (type === 'message') {
      this.messages[item.message_id] = item;
    } else if (type === 'flight') {
      this.flights[item.meta.suggestion_id] = item;
      item.type = 'flight';
    } else if (type === 'comment') {
      console.log(this.comments[item.timestamp])
      this.comments[item.timestamp] = item;
      // this.messages[item.message_id].comments.push(item);
      this.mergeComments();
      console.log(this.comments[item.timestamp])
      this.createFeed();
      return;
    }
    this.feed[Date.now()] = item;
  }

}

module.exports = ChatController;


