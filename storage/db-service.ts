import {IOS_LIBRARY_PATH, ANDROID_FILES_PATH, open} from '@op-engineering/op-sqlite';
import {Platform} from 'react-native';

export interface IData {
    levels: number;
    day: number;
    measurement: string;
    label: string;
}

const db = open({name: 'glucose-log', location: Platform.OS === 'ios' ? IOS_LIBRARY_PATH : ANDROID_FILES_PATH});

export function initTable() {
    const query = `CREATE TABLE IF NOT EXISTS glucose_log(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        levels INTEGER NOT NULL,
        measurement TEXT NOT NULL,
        label TEXT NOT NULL DEFAULT '',
        day INTEGER NOT NULL
    )`;
    db.execute(query);
}

export function addData(data: IData) {
    let query: string;
    query = `
        INSERT INTO glucose_log (levels,measurement, day,label)
        VALUES (?,?,?,?)
    `;
    // }
    db.execute(query, [data.levels, data.measurement, data.day, data.label]);
}

export function readData() {
    try {
        const {rows} = db.execute('SELECT * FROM glucose_log');
        return rows?._array;
    } catch (error: any) {
        console.error('Something went wrong executing SQL commands:', error.message);
    }
}
