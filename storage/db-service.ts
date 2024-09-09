import {IOS_LIBRARY_PATH, ANDROID_FILES_PATH, open, DB as Database} from '@op-engineering/op-sqlite';
import {Platform} from 'react-native';
import themeContext from '@react-navigation/native/src/theming/ThemeContext';
import {useDataRange} from '@/storage/atoms/range';

export type ILog = {
    id?: number;
    value: number;
    timestamp: number;
    label: string;
};

export type PercentageRange = {
    range: number;
};

class DB {
    private static instance: DB;
    private db: Database;

    private constructor() {
        this.db = open({
            name: 'db-glucose-log',
            location: Platform.OS === 'ios' ? IOS_LIBRARY_PATH : ANDROID_FILES_PATH,
        });
        this.init();
        this.timeStampIndex();
    }

    public static getInstance(): DB {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;
    }

    public init(): void {
        try {
            const createQuery = `CREATE TABLE IF NOT EXISTS log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                value DOUBLE NOT NULL,
                timestamp INTEGER NOT NULL,
                label TEXT NOT NULL DEFAULT ''
            )`;
            this.db.execute(createQuery);
        } catch (e) {
            console.log(e);
        }
    }

    public timeStampIndex(): void {
        const query = `CREATE INDEX IF NOT EXISTS idx_timestamp ON log(timestamp);`;
        this.db.execute(query);
    }

    public record(data: ILog): void {
        const query = `
            INSERT INTO log (value,timestamp,label)
            VALUES (?,?,?)
        `;
        this.db.execute(query, [data.value, data.timestamp, data.label]);
    }

    public getAll(timeStamp: number): ILog[] | undefined {
        const {rows} = this.db.execute('SELECT * FROM log WHERE timestamp >= ?', [timeStamp]);
        return rows?._array;
    }

    public clearAll(): void {
        this.db.execute('DELETE FROM log');
    }

    public getRange(maxVal: number, minVal: number): PercentageRange {
        const query = `SELECT ROUND((CAST(SUM(CASE WHEN value >= ${minVal} AND value <= ${maxVal} THEN 1 ELSE 0 END) AS FLOAT)/ COUNT(*)) * 100,2) AS range FROM log;`;
        const {rows} = this.db.execute(query);
        return rows?._array[0];
    }
}

export default DB;
