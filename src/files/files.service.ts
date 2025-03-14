import {Injectable, Inject} from '@nestjs/common';
import {Queue} from 'bull';
import {InjectQueue} from '@nestjs/bull';
import {IFilesRepository} from "./repository/IFilesRepository";
import {FileEntity, FileStatus} from "./entities/file.entity";


@Injectable()
export class FilesService {
    constructor(
        @Inject('IFilesRepository')
        private readonly filesRepository: IFilesRepository,
        @InjectQueue('files')
        private readonly filesQueue: Queue,
    ) {
    }

    async createUploadTasks(urls: string[]): Promise<FileEntity[]> {
        const result: FileEntity[] = [];
        const {PENDING, UPLOADING} = FileStatus;

        for (const url of urls) {
            const existing = await this.filesRepository.findByOriginalUrl(url);

            if (existing) {
                console.log(`File with URL '${url}' already exists (ID: ${existing.id})`);
                result.push(existing);
                continue;
            }

            const file = new FileEntity();
            file.originalUrl = url;
            file.status = PENDING;

            const [created] = await this.filesRepository.save([file]);
            result.push(created);

            await this.filesQueue.add("upload", {
                fileId: created.id,
                fileUrl: created.originalUrl,
            });
        }

        return result;
    }

    async findAll(): Promise<FileEntity[]> {
        return this.filesRepository.find();
    }

    async setStatusUploading(fileId: number): Promise<void> {
        await this.filesRepository.update(fileId, {status: FileStatus.UPLOADING});
    }

    async setStatusDone(fileId: number, driveLink: string): Promise<void> {
        await this.filesRepository.update(fileId, {
            status: FileStatus.DONE,
            driveLink,
        });
    }

    async setStatusError(fileId: number): Promise<void> {
        await this.filesRepository.update(fileId, {status: FileStatus.ERROR});
    }
}
