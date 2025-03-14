import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';

import {ThrottlerModule} from "@nestjs/throttler";
import {FilesModule} from "./files/files.module";
import { AuthModule } from './auth/auth.module';
import typeorm, {typeOrmConfig} from './config/ormconfig';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import {BullModule} from "@nestjs/bull";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[typeorm]
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: +process.env.REDIS_PORT || 6379,
      },
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 20 }]),
    FilesModule,
    AuthModule,
    GoogleDriveModule,
  ],
})
export class AppModule {}
