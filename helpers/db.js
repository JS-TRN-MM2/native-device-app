import * as SQLite from 'expo-sqlite';
import { realpath } from 'fs-extra';

const db = SQLite.openDatabase('places.db');

const init = () => {};

export const init = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEST NOT NULL, address TEST NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL;',
                [],
                () => {
                    resolve();
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });
    return promise;
};