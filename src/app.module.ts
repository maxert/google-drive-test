import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';

import {ThrottlerModule} from "@nestjs/throttler";
import {FilesModule} from "./files/files.module";
import { AuthModule } from './auth/auth.module';
import typeorm, {typeOrmConfig} from './config/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[typeorm]
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 20 }]),
    FilesModule,
    AuthModule,
  ],
})
export class AppModule {}
