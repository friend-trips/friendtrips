import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl, { Marker } from 'mapbox-gl';
import styled from 'styled-components';
import { accessToken } from '../../../configs/mapbox.config.js';
import MarkerPopup from './MarkerPopup.jsx'
import axios from 'axios';
import HotelTooltip from './HotelTooltip.jsx'
// import POIToolTip from './containers/POITooltipContainer.js'
import POIToolTip from './POIToolTip.jsx'
import amadeus from '../lib/amadeus.js'

const Map = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

const Pin = styled.div`
  height: 20px;
  width: 20px;
  background-color: 'orange';
`;

let mapContainer = React.createRef(null)
mapboxgl.accessToken = accessToken;

const Mapbox = ({ hotels, pois, searchResults, getSavedPOIs, searchForPOIs }) => {
  const [lng, setLng] = useState(-74.017204);
  const [lat, setLat] = useState(40.705658);
  const [zoom, setZoom] = useState(12);

  const createPOI = (map, poi) => {
    if (poi.geoCode) {
      poi.longitude = poi.geoCode.longitude;
      poi.latitude = poi.geoCode.latitude;
    }
    let imgToShow = poi.category === 'RESTAURANT' ? 'foodMarker' : poi.category === 'SIGHTS' ? '001-event' : poi.category === 'SHOPPING' ? 'shoppingMarker' : 'drinksMarker'
    let tooltipDiv = document.createElement('div');
    ReactDOM.render(
      <POIToolTip poi={poi} />, tooltipDiv)
    let newTooltip = new mapboxgl.Popup({ offset: 15 })
    newTooltip
      .setDOMContent(tooltipDiv)
    let marker = document.createElement('div');
    ReactDOM.render(
      <img src={`./assets/images/${imgToShow}.png`} />, marker)
    let newMarker = new mapboxgl.Marker({ color: 'green', element: marker })
      .setLngLat([poi.longitude, poi.latitude])
      .setPopup(newTooltip)
      .addTo(map);
  }

  useEffect(() => {

    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    //adds navigation control
    // map.addControl(
    //   new MapboxDirections({
    //   accessToken: mapboxgl.accessToken
    //   }),
    //   'top-left'
    //   );

    //adds location search control
    // map.addControl(
    //   new MapboxGeocoder({
    //     accessToken: mapboxgl.accessToken,
    //     mapboxgl: mapboxgl
    //   })
    // );
    const searchNearHotel = (long, lat) => {
      map.panTo([long, lat], { duration: 1000 });
      getData(lat, long)
        .then(({ data }) => {
          console.log('poi {data}: ', data)
          data.forEach((poi) => {
            createPOI(map, poi);
          })
        })
        .catch((err) => {
          console.log('poi search err', err)
        })
    }
    map.on('load', () => {
      hotels.forEach((hotel) => {

        let tooltipDiv = document.createElement('div');
        ReactDOM.render(
          <HotelTooltip hotel={hotel} searchNearHotel={searchNearHotel} />, tooltipDiv)
        let newTooltip = new mapboxgl.Popup({ offset: 15 })
        newTooltip
          .setDOMContent(tooltipDiv)

        let hotelMarkerDiv = document.createElement('div');
        ReactDOM.render(
          <div><img
            style={{ height: '3rem' }}
            src="./assets/images/hotelMarker.png"></img></div>, hotelMarkerDiv)
        let newMarker = new mapboxgl.Marker({ color: 'red', element: hotelMarkerDiv })
          .setLngLat([hotel.longitude, hotel.latitude])
          .setPopup(newTooltip)
          .addTo(map);
      })


      axios.get('https://morning-bayou-59969.herokuapp.com/pois')
        .then((result) => {
          console.log('get all pois', result)
          let savedPois = result.data.map((poi) => {
            poi.isSaved = true;
            return poi
          });
          result.data.forEach((poi) => {
            createPOI(map, poi);
          })
        })
        .catch((err) => {
          console.log('get all poi err', err);
        })

    })

    map.on('dblclick', (pointer) => {
      console.log(pointer)
      // Specify that the panTo animation should last 5000 milliseconds.
      map.panTo([pointer.lngLat.lng, pointer.lngLat.lat], { duration: 1000 });

      getData(pointer.lngLat.lat, pointer.lngLat.lng)
        .then(({ data }) => {
          console.log('poi {data}: ', data)
          data.forEach((poi) => {
            createPOI(map, poi)
          })
        })
        .catch((err) => {
          console.log('poi search err', err)
        })
    })
  }, []);



  const getData = (lat, long) => {
    return amadeus.referenceData.locations.pointsOfInterest.get({
      latitude: lat,
      longitude: long
    })
  }

  return (
    <div>
      <Map ref={el => mapContainer = el} />
    </div>
  )
}

export default Mapbox;