import {IOS_LIBRARY_PATH, ANDROID_FILES_PATH, open, DB as Database} from '@op-engineering/op-sqlite';
import {Platform} from 'react-native';

export type ILog = {
    id?: number;
    value: number;
    timestamp: number;
    label: string;
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

    public getAll(): ILog[] | undefined {
        const {rows} = this.db.execute('SELECT * FROM log');
        return rows?._array;
    }

    public clearAll(): void {
        this.db.execute('DELETE FROM log');
    }
}

export default DB;
