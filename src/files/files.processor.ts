import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { FilesService } from './files.service';
import { Inject, Injectable } from '@nestjs/common';
import { IGoogleDriveService } from 'src/google-drive/google-drive.interface';

@Processor('files')
@Injectable()
export class FilesProcessor {
    constructor(
        private readonly filesService: FilesService,

        @Inject('IGoogleDriveService')
        private readonly googleDriveService: IGoogleDriveService,
    ) {}

    @Process('upload')
    async handleUpload(job: Job<{ fileId: number; fileUrl: string }>) {
        console.log('Процесор узяв завдання з ID:', job.id, job.data);

        const { fileId, fileUrl } = job.data;
        try {
            await this.filesService.setStatusUploading(fileId);
            const driveLink = await this.googleDriveService.uploadByUrl(fileUrl);
            await this.filesService.setStatusDone(fileId, driveLink);
        } catch (error) {
            await this.filesService.setStatusError(fileId);
            throw error;
        }
    }
}
