import { Controller, Post, Body, Get, Logger, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { UploadFilesDto } from './dto/upload-files.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {ThrottlerGuard} from "@nestjs/throttler";

@UseGuards(ThrottlerGuard)
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('upload')
    upload(@Body() dto: UploadFilesDto) {
        return this.filesService.uploadFiles(dto.urls);
    }

    @Get()
    findAll() {
        return this.filesService.getAllFiles();
    }
}
