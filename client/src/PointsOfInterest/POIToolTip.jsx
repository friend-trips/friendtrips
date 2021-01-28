import React from 'react';

const POIToolTip = ({poi, saveSearchResult, user_id, emitChange}) => {

  const savePOI = () => {
    //TODO: figure out why authContext returns undefined here
    let newPOI = {
      trip_id: 1,
      user_id: user_id,
      poi_id: poi.id,
      name: poi.name,
      category: poi.category,
      tags: poi.tags,
      latitude: poi.geoCode.latitude,
      longitude: poi.geoCode.longitude,
      created: new Date()
    }
    // saveSearchResult(newPOI);
    emitChange('addPOI', newPOI);
  }
  return (
    <div>
      <p>{poi.name}</p>
      <p>{poi.category}</p>
      {!poi.isSaved ?
      <button onClick={() => { savePOI() }}> Save </button>:
      null
      }
    </div>
  );
};

export default POIToolTip;