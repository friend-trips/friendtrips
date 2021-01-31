const filterData = (arr) => {
  const newArr = arr.map((result) => {
    const filteredResult = {};
    // store the hotelId
    filteredResult["hotelId"] = result["hotel"]["hotelId"];
    // store the name
    filteredResult["name"] = result["hotel"]["name"];
    // store the location
    const postalCode = result["hotel"]["address"]["postalCode"]
      ? " " + result["hotel"]["address"]["postalCode"]
      : "";
    const address =
      result["hotel"]["address"]["lines"][0] +
      " " +
      result["hotel"]["address"]["cityName"] +
      " " +
      result["hotel"]["address"]["countryCode"] +
      postalCode;
    filteredResult.latitude = result.hotel.latitude;
    filteredResult.longitude = result.hotel.longitude;
    filteredResult["address"] = address;
    filteredResult["rating"] = result["hotel"]["rating"];
    // store the hotel amenities
    filteredResult["amenities"] = result["hotel"]["amenities"];
    filteredResult["milesFromCenter"] =
      result["hotel"]["hotelDistance"]["distance"];
    return filteredResult;
  });

  console.log("this is the new arr", newArr);
  return newArr;
}

export default filterData;