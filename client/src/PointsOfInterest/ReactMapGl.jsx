import * as React from 'react';
import { useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { accessToken } from '../../../configs/mapbox.config.js'

const Map = ({hotels}) => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });
  const [markers, setMarkers] = useState([])
  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={accessToken}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onClick={(pointerEvent) => {
        console.log(pointerEvent);
        setMarkers([...markers, pointerEvent]);
      }}
    >
      {markers.map((marker, i) => {
        return (
          <Marker latitude={marker.lngLat[1]}
          longitude={marker.lngLat[0]}>
            <div>m</div>
          </Marker>
        )
      })}
    </ReactMapGL>
  );
}

export default Map;