import {Injectable, Logger, ConflictException, HttpStatus} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {google, drive_v3} from 'googleapis';
import axios, {AxiosResponse} from 'axios';
import {UploadedFile} from './entities/uploaded-file.entity';
import * as path from 'path';
import {Readable} from 'stream';
import {GaxiosResponse, GoogleAuth} from 'googleapis-common';

@Injectable()
export class FilesService {
    private driveClient: drive_v3.Drive;
    private readonly logger: Logger = new Logger(FilesService.name);

    constructor(
        @InjectRepository(UploadedFile)
        private fileRepository: Repository<UploadedFile>,
    ) {
        const keyFilePath = path.join(process.cwd(), 'client_secret.json');

        const auth: GoogleAuth = new google.auth.GoogleAuth({
            keyFile: keyFilePath,
            scopes: ['https://www.googleapis.com/auth/drive'],
        });

        auth.getClient()
            .then(() => this.logger.log('✅ Successfully connected to Google Drive API'))
            .catch((error) => {
                this.logger.error('❌ Google Drive authentication error:', error);
            });

        this.driveClient = google.drive({version: 'v3', auth});
    }

    private extractFileName(url: string): string {
        try {
            const parsedUrl = new URL(url);
            const fileName = path.basename(parsedUrl.pathname);
            return fileName || 'unknown';
        } catch (error) {
            this.logger.error(`Ошибка парсинга URL: ${url}`, error);
            return 'unknown';
        }
    }

    async uploadFiles(urls: string[]): Promise<UploadedFile[]> {
        const successfulFiles: UploadedFile[] = [];
        const failedUploads: string[] = [];

        for (const url of urls) {
            try {
                const fileName: string = this.extractFileName(url);

                const existingFile = await this.fileRepository.findOne({where: {filename: fileName}});
                if (existingFile) {
                    this.logger.error(`File "${fileName}" already exists in the database.`);
                    failedUploads.push(url);
                    continue;
                }


                const response: AxiosResponse<Readable> = await axios.get(url, {responseType: 'stream'});
                const fileMetadata: drive_v3.Schema$File = {name: fileName};

                const uploadedFile: GaxiosResponse<drive_v3.Schema$File> = await this.driveClient.files.create({
                    requestBody: fileMetadata,
                    media: {body: response.data},
                    fields: 'id,webViewLink,webContentLink',
                });


                const file: UploadedFile = this.fileRepository.create({
                    filename: fileName,
                    driveFileId: uploadedFile.data.id!,
                    webViewLink: uploadedFile.data.webViewLink!,
                    webContentLink: uploadedFile.data.webContentLink!,
                });

                await this.fileRepository.save(file);
                successfulFiles.push(file);
            } catch (error) {
                this.logger.error(`Failed to upload file from URL ${url}`, error);
                failedUploads.push(url);
            }
        }

        if (failedUploads.length > 0) {
            this.logger.warn(`Uploaded ${successfulFiles.length} out of ${urls.length} files`);
            throw new ConflictException({
                statusCode: HttpStatus.CONFLICT,
                message: `Some files failed to upload.`,
                failedUploads,
                successfulFiles,
            });
        }

        this.logger.log('All files were uploaded successfully');
        return successfulFiles;
    }

    async getAllFiles(): Promise<UploadedFile[]> {
        return this.fileRepository.find();
    }
}
