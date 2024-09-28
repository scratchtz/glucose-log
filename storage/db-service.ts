import {IOS_LIBRARY_PATH, ANDROID_FILES_PATH, open, DB as Database} from '@op-engineering/op-sqlite';
import {Platform} from 'react-native';

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

            const indexQuery = `CREATE INDEX IF NOT EXISTS idx_timestamp ON log(timestamp);`;
            this.db.execute(indexQuery);
        } catch (e) {
            console.log(e);
        }
    }

    public record(data: ILog): void {
        const query = `
            INSERT INTO log (value,timestamp,label)
            VALUES (?,?,?)
        `;
        this.db.execute(query, [data.value, data.timestamp, data.label]);
    }

    public delete(id: number): void {
        const query = `DELETE FROM log WHERE id = ?`;
        this.db.execute(query, [id]);
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
