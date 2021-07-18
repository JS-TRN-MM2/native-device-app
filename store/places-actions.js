import * as FileSystem from 'expo-file-system';

export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';

import { fetchPlaces, insertPlace } from '../helpers/db';

export const addPlace = (title, image) => {
  return async dispatch => {
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
        'Dummy address', 
        15.6, 
        12.3
      );
      console.log(dbResult);
      dispatch({ type: ADD_PLACE, placeData: { id: dbResult.insertId, title: title, image: newPath }})
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
