import {InjectRepository} from "@nestjs/typeorm";
import {ConflictException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {Repository} from "typeorm";
import {UploadedFile} from "./entities/uploaded-file.entity";
import {GoogleDriveService} from "../google-drive/google-drive.service";
import {FileDownloader} from "./file-downloader.service";
import {Readable} from "stream";
import {CreateUploadedFileDto} from "./dto/create-uploaded-file.dto";

@Injectable()
export class FilesService {
    private readonly logger: Logger = new Logger(FilesService.name);

    constructor(
        @InjectRepository(UploadedFile) private fileRepository: Repository<UploadedFile>,
        private googleDriveService: GoogleDriveService,
        private fileDownloader: FileDownloader,
    ) {
    }

    private extractFileName(url: string): string {
        try {
            return new URL(url).pathname.split('/').pop() || 'unknown';
        } catch (error) {
            this.logger.error(`Error parsing URL: ${url}`, error);
            return 'unknown';
        }
    }

    async uploadFiles(urls: string[]): Promise<UploadedFile[]> {
        const successfulFiles: UploadedFile[] = [];
        const failedUploads: string[] = [];

        for (const url of urls) {
            try {
                const fileName = this.extractFileName(url);

                const existingFile = await this.fileRepository.findOne({where: {filename: fileName}});
                if (existingFile) {
                    this.logger.warn(`File "${fileName}" already exists in the database.`);
                    failedUploads.push(url);
                    continue;
                }

                const fileStream: Readable = await this.fileDownloader.download(url);

                const uploadedFile = await this.googleDriveService.uploadFile(fileStream, fileName);

                const file = await this.createUploadedFile({
                    filename: fileName,
                    driveFileId: uploadedFile.id,
                    webViewLink: uploadedFile.webViewLink,
                    webContentLink: uploadedFile.webContentLink,
                });

                successfulFiles.push(file);
            } catch (error) {
                this.logger.error(`Failed to upload file from URL: ${url}`, error);
                failedUploads.push(url);
            }
        }

        if (failedUploads.length > 0) {
            throw new ConflictException({
                statusCode: HttpStatus.CONFLICT,
                message: 'Some files failed to upload.',
                failedUploads,
                successfulFiles,
            });
        }

        this.logger.log(`Successfully uploaded ${successfulFiles.length} files.`);

        return successfulFiles;
    }

    async createUploadedFile({
                                 filename,
                                 driveFileId,
                                 webViewLink,
                                 webContentLink,
                             }: CreateUploadedFileDto): Promise<UploadedFile> {
        const file = this.fileRepository.create({filename, driveFileId, webViewLink, webContentLink});
        await this.fileRepository.save(file);
        return file;
    }

    async getAllFiles(): Promise<UploadedFile[]> {
        return this.fileRepository.find();
    }
}
