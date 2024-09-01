import {IOS_LIBRARY_PATH, ANDROID_FILES_PATH, open} from '@op-engineering/op-sqlite';
import {Platform} from 'react-native';

export interface IData {
    levels: number;
    day: number;
}

const db = open({name: 'glucose-log', location: Platform.OS === 'ios' ? IOS_LIBRARY_PATH : ANDROID_FILES_PATH});

export function createTable() {
    const query = `CREATE TABLE IF NOT EXISTS glucose_log(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        levels REAL NOT NULL,
        day INTEGER NOT NULL
    )`;
    db.execute(query);
}

export function addData(data: IData) {
    const {res} = db.execute(`SELECT day FROM glucose_log WHERE day = ?`, [data.day]);
    let query: string;

    // re-write if the day is the same
    if (res) {
        query = `UPDATE glucose_log SET levels = ? WHERE day = ?;`;
    } else {
        query = `
        INSERT INTO glucose_log (levels, day)
        VALUES (?, ?)
    `;
    }
    db.execute(query, [data.levels, data.day]);
}

export function readData() {
    try {
        const {rows} = db.execute('SELECT * FROM glucose_log');
        return rows?._array;
    } catch (error: any) {
        console.error('Something went wrong executing SQL commands:', error.message);
    }
}
createTable();
