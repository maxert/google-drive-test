import {DataSource, DataSourceOptions} from "typeorm";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import { registerAs } from "@nestjs/config";
import {config as dotenv} from "dotenv";
import  * as path from 'path'
dotenv()

export const typeOrmConfig: PostgresConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'database',
    entities: [path.join(__dirname, '../','/**/*.entity.{js,ts}')],
    migrations: [path.join(__dirname, '../','/database/**/*.{js,ts}')],
    synchronize: false,
}

export default registerAs('typeorm', () => typeOrmConfig)
export const connectionSource = new DataSource(typeOrmConfig as DataSourceOptions)