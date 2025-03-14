import {Controller, Post, Body, Get, UseGuards} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileEntity } from './entities/file.entity';
import {CreateUploadedFileDto} from "./dto/create-uploaded-file.dto";
import {ThrottlerGuard} from "@nestjs/throttler";


@UseGuards(ThrottlerGuard)
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post()
    async uploadFiles(@Body() createFileDto: CreateUploadedFileDto): Promise<FileEntity[]> {
        return this.filesService.createUploadTasks(createFileDto.urls);
    }

    @Get()
    async getAllFiles(): Promise<FileEntity[]> {
        return this.filesService.findAll();
    }
}
