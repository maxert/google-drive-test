import {Module} from '@nestjs/common';
import {FilesController} from './files.controller';
import {FilesService} from './files.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UploadedFile} from "./entities/uploaded-file.entity";
import {GoogleDriveModule} from "../google-drive/google-drive.module";
import {FileDownloader} from "./file-downloader.service";

@Module({
    imports: [TypeOrmModule.forFeature([UploadedFile]), GoogleDriveModule],
    controllers: [FilesController],
    providers: [FilesService, FileDownloader]
})
export class FilesModule {
}
