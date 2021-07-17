import * as FileSystem from 'expo-file-system';

export const ADD_PLACE = 'ADD_PLACE';
import { insertPlace } from '../helpers/db';

export const addPlace = (title, image) => {
  console.log('made it to addPlace');
  console.log('what is image', image);
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
