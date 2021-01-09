import * as React from 'react';
import { useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { accessToken } from '../../../configs/mapbox.config.js'
import MarkerPopup from './MarkerPopup.jsx'

import amadeus from '../lib/amadeus.js'

const Map = () => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 12
  });
  const [markers, setMarkers] = useState([]);

  const getData = (lat, long) => {
    amadeus.referenceData.locations.pointsOfInterest.get({
      latitude: lat,
      longitude: long
    })
      .then(({ data }) => {
        console.log('poi {data}: ', data)
        setMarkers(data)
      })
      .catch((err) => {
        console.log('poi search err', err)
      })
  }
  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={accessToken}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={(pointerEvent) => {
        console.log(pointerEvent);
        getData(pointerEvent.lngLat[1], pointerEvent.lngLat[0])
        // setMarkers([...markers, pointerEvent]);
      }}
      mapStyle={"mapbox://styles/mapbox/streets-v11"}
    >
      {markers.map((marker, i) => {
        return (
          <Marker latitude={marker.geoCode.latitude}
            longitude={marker.geoCode.longitude}>
              <MarkerPopup poi={marker} />
          </Marker>
        )
      })}
    </ReactMapGL>
  );
}

export default Map;