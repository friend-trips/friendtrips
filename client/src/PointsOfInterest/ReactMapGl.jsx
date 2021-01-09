import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { accessToken } from '../../../configs/mapbox.config.js'
import MarkerPopup from './MarkerPopup.jsx';
import axios from 'axios';

import amadeus from '../lib/amadeus.js'
import cookieParser from 'cookie-parser';

const Map = ({ selectedTrip }) => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 12
  });
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    getSavedPOIs();
  }, [])

  const getSavedPOIs = () => {
    axios.get('http://localhost:4001/pois')
      .then((result) => {
        console.log('get all pois', result)
        let savedPois = result.data.map((poi) => {
          poi.isSaved = true;
          return poi
        })
        setMarkers(savedPois);
      })
      .catch((err) => {
        console.log('get all poi err', err);
      })
  }

  const getData = (lat, long) => {
    amadeus.referenceData.locations.pointsOfInterest.get({
      latitude: lat,
      longitude: long
    })
      .then(({ data }) => {
        console.log('poi {data}: ', data)
        setMarkers([...markers, ...data])
      })
      .catch((err) => {
        console.log('poi search err', err)
      })
  }
  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={accessToken}
      mapStyle={"mapbox://styles/mapbox/streets-v11"}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={(pointerEvent) => {
        console.log(pointerEvent);
        getData(pointerEvent.lngLat[1], pointerEvent.lngLat[0])
      }}
      onLoad={(map) => {
        //add geoCoder (location search) control
        //TODO: figure out how to remove old markers when this thing pans the camera to a different spot on the map
        map.target.addControl(
          new MapboxGeocoder({
            accessToken: accessToken,
            mapboxgl: map.target
          })
        );
        //add navigation controll
        // map.target.addControl(
        //   new MapboxDirections({
        //     accessToken: accessToken
        //   }),
        //   'top-left'
        // );
      }}
    >
      {markers.map((marker, i) => {
        const lat = marker.geoCode ? marker.geoCode.latitude : Number(marker.latitude);
        const long = marker.geoCode ? marker.geoCode.longitude : Number(marker.longitude);
        return (
          <Marker
            latitude={lat}
            longitude={long}
          >
            <MarkerPopup poi={marker} selectedTrip={selectedTrip} />
          </Marker>
        )
      })}
    </ReactMapGL>
  );
}

export default Map;