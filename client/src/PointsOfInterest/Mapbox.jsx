import React, { useState, useEffect } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl';
import styled from 'styled-components';
import { accessToken } from '../../../configs/mapbox.config.js';

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
  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(2);
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.on('click', (pointerEvent) => {
      console.log(pointerEvent)
      setMarkers([...markers,  pointerEvent.lngLat ]);
      let newMarker = new mapboxgl.Marker()
          .setLngLat([pointerEvent.lngLat.lng, pointerEvent.lngLat.lat])
          .addTo(map);
    })
  }, [])

  useEffect(() => {
    let newMarker = new mapboxgl.Marker()
          .setLngLat([30.5, 50.5])
          // .addTo(map)
  }, [markers])

  return (
    <div>
      <Map ref={el => mapContainer = el} />
      {/* {markers} */}
    </div>
  )
}

export default Mapbox;