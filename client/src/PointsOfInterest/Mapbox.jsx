import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl, { Marker } from 'mapbox-gl';
import styled from 'styled-components';
import axios from 'axios';
import HotelTooltip from './HotelTooltip.jsx'
import MapControlMenu from './MapControlMenu.jsx'
import POIToolTip from './POIToolTip.jsx'
import { AuthContext } from '../components/providers/AuthenticationProvider.jsx'
import { ApplicationContext } from '../components/providers/ApplicationProvider.jsx'

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
let mapContainer = React.createRef(null);
// if (!process.env.MAPBOX_TOKEN) {
//   import('../../../configs/mapbox.config')
//     .then((r) => {
//       mapboxgl.accessToken = r.default.accessToken
//     })
//     .catch((err) => { console.log('import err', err)})
// } else {
//   mapboxgl.accessToken = process.env.MAPBOX_TOKEN
// }
// mapboxgl.accessToken = accessToken;


const Mapbox = ({ hotels, pois, searchResults, getSavedPOIs, searchForPOIs, saveSearchResult }) => {
  const [mapLoading, setMapLoading] = useState(true);
  const [lng, setLng] = useState(-74.017204);
  const [lat, setLat] = useState(40.705658);
  const [zoom, setZoom] = useState(12);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapControl, setMapControl] = useState(null);
  const [currentControl, setCurrentControl] = useState('none');

  const authContext = useContext(AuthContext);
  const appContext = useContext(ApplicationContext);

  const createPOI = (map, poi) => {
    if (poi.geoCode) {
      poi.longitude = poi.geoCode.longitude;
      poi.latitude = poi.geoCode.latitude;
    }
    let imgToShow = poi.category === 'RESTAURANT' ? 'foodMarker' : poi.category === 'SIGHTS' ? '001-event' : poi.category === 'SHOPPING' ? 'shopping (1)' : 'drinksMarker'

    let tooltipDiv = document.createElement('div');
    ReactDOM.render(
      <POIToolTip
        poi={poi}
        saveSearchResult={saveSearchResult}
        user_id={authContext.user}
        emitChange={appContext.emitChange}
      />, tooltipDiv)
    let newTooltip = new mapboxgl.Popup({ offset: 15 })
    newTooltip.setDOMContent(tooltipDiv)

    let marker = document.createElement('div');
    ReactDOM.render(<img src={`./assets/images/${imgToShow}.png`} />, marker)
    let newMarker = new mapboxgl.Marker({ color: 'green', element: marker })
      .setLngLat([poi.longitude, poi.latitude])
      .setPopup(newTooltip)
      .addTo(map);
  }

  useEffect(() => {
    axios.get('https://morning-bayou-59969.herokuapp.com/api/mapbox')
      .then(({ data }) => {
        mapboxgl.accessToken = data;
        setMapLoading(false);
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!mapLoading) {
      const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
      });

      const searchNearHotel = (long, lat) => {
        map.panTo([long, lat], { duration: 1000 });
        searchForPOIs({ latitude: lat, longitude: long })
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
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        getSavedPOIs((err, data) => {
          if (!err) {
            console.log('get all pois')
            let savedPois = data.map((poi) => {
              poi.isSaved = true;
              return poi
            });
            data.forEach((poi) => {
              createPOI(map, poi);
            })
          }
        })
      })

      map.on('dblclick', (pointer) => {
        console.log(pointer)
        // Specify that the panTo animation should last 5000 milliseconds.
        map.panTo([pointer.lngLat.lng, pointer.lngLat.lat], { duration: 1000 });
        searchForPOIs({ latitude: pointer.lngLat.lat, longitude: pointer.lngLat.lng })
      })

      setMapInstance(map);
    }
  }, [mapLoading]);

  useEffect(() => {
    if (mapInstance && mapControl) {
      setMapControl(null);
      mapInstance.removeControl(mapControl);
    }
    if (currentControl === 'navigator') {
      const currentMapControl = new MapboxDirections({
        accessToken: mapboxgl.accessToken
      });
      setMapControl(currentMapControl);
      mapInstance.addControl(currentMapControl)
    } else if (currentControl === 'geocoder') {
      let marker = document.createElement('div');
      ReactDOM.render(
        <img src={`./assets/images/006-marker-1.png`} />, marker)
      const currentMapControl = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: { element: marker }
      })
      setMapControl(currentMapControl);
      mapInstance.addControl(currentMapControl)
    }
  }, [currentControl])

  useEffect(() => {
    console.log('add new search results', searchResults)
    if (mapInstance) {
      searchResults.forEach((poi) => {
        createPOI(mapInstance, poi);
      })
    }
  }, [searchResults])

  return (
    <div>
      <MapControlMenu currentControl={currentControl} setCurrentControl={setCurrentControl} />
      {mapLoading ?
        <div> Loading POIs... </div> :
        <Map ref={el => mapContainer = el} />
      }
    </div>
  )
}

export default Mapbox;