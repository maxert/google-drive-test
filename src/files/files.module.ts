import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmFilesRepository } from './repository/files.repository';
import { IFilesRepository } from './repository/IFilesRepository';

import { BullModule } from '@nestjs/bull';
import { FilesProcessor } from './files.processor';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import {FileEntity} from "./entities/file.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([FileEntity]),
        GoogleDriveModule,
        BullModule.registerQueue({ name: 'files' }),
    ],
    controllers: [FilesController],
    providers: [
        FilesService,
        FilesProcessor,
        {
            provide: 'IFilesRepository',
            useClass: TypeOrmFilesRepository,
        },
    ],
    exports: ['IFilesRepository'],
})
export class FilesModule {}
