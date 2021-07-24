import * as FileSystem from 'expo-file-system';

export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';

import { fetchPlaces, insertPlace } from '../helpers/db';
import ENV from '../env';

export const addPlace = (title, image, location) => {
  console.log('image', image);
  return async dispatch => {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${
      location.lat}&lon=${
      location.lng}&apiKey=${
        ENV.geoApiKey}`)
    .catch(error => {
      console.log('error', error);
      throw new Error(error);
    });

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();
    if(!resData.features) {
      throw new Error('Something went wrong!');
    }
    const address = resData.features[0].properties.formatted;

    const fileName = image.split('/').pop();
    console.log('fileName is ', fileName);
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath
      });
      const dbResult = await insertPlace(
        title, 
        newPath, 
        address, 
        location.lat, 
        location.lng
      );
      console.log(dbResult);
      dispatch({ 
        type: ADD_PLACE, 
        placeData: { 
          id: dbResult.
          insertId, 
          title: title, 
          image: newPath,
          address: address,
          coords: {
            lat: location.lat,
            lng: location.lng
          }
        }
      })
    } catch (err) {
      // could create an alert here
      console.log(err);
      throw err;
    }

    dispatch({ 
      type: ADD_PLACE, placeData: {
        title: title, 
        image: newPath
      }})
    }; 
};

export const loadPlaces = () => {
  return async dispatch => {
    try {
      const dbResult = await fetchPlaces();
      console.log(dbResult);
      // to test this, we ran this dispatch with empty array, looked at dbResult in console log
      // and you can see how to access the data...  in _array
      //dispatch ({ type: SET_PLACES, places: []);
      dispatch ({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
    
  };
};
