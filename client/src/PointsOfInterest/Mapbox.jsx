import React, { useState, useEffect } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl';
import styled from 'styled-components';
import { accessToken } from '../../../configs/mapbox.config.js';
import MarkerPopup from './MarkerPopup.jsx'
import axios from 'axios';

import amadeus from '../lib/amadeus.js'

const Map = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

let mapContainer = React.createRef(null)
mapboxgl.accessToken = accessToken;

const Mapbox = () => {
  const [lng, setLng] = useState(-122.4376);
  const [lat, setLat] = useState(37.7577);
  const [zoom, setZoom] = useState(12);
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.on('load', () => {

      axios.get('http://localhost:4001/pois')
        .then((result) => {
          console.log('get all pois', result)
          let savedPois = result.data.map((poi) => {
            poi.isSaved = true;
            return poi
          });
          result.data.forEach((poi) => {
            let htmlString = `
            <div>
              <p>${poi.name}</p>
              <p>${poi.category}</p>
            </div>`
            ;
            let newMarker = new mapboxgl.Marker()
              .setLngLat([poi.longitude, poi.latitude])
              .setPopup(new mapboxgl.Popup().setHTML(htmlString))
              .addTo(map);
          })
          setMarkers(savedPois);
        })
        .catch((err) => {
          console.log('get all poi err', err);
        })

    })

    map.on('dblclick', (pointer) => {
      console.log(pointer)
      setMarkers([...markers, pointer.lngLat]);
      // Specify that the panTo animation should last 5000 milliseconds.
      map.panTo([pointer.lngLat.lng, pointer.lngLat.lat], { duration: 1000 });

      getData(pointer.lngLat.lat, pointer.lngLat.lng)
        .then(({ data }) => {
          console.log('poi {data}: ', data)
          data.forEach((poi) => {
            let { name, category } = poi;
            let htmlString = `
              <div>
                <p>${poi.name}</p>
                <p>${poi.category}</p>
              </div>`
              ;
            let newMarker = new mapboxgl.Marker()
              .setLngLat([poi.geoCode.longitude, poi.geoCode.latitude])
              .setPopup(new mapboxgl.Popup().setHTML(htmlString))
              .addTo(map);
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
      {/* {markers} */}
    </div>
  )
}

export default Mapbox;