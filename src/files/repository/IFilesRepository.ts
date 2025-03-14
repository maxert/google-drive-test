import {FileEntity} from "../entities/file.entity";


export interface IFilesRepository {
    save(entities: FileEntity[]): Promise<FileEntity[]>;
    update(id: number, partial: Partial<FileEntity>): Promise<void>;
    find(): Promise<FileEntity[]>;
    findByOriginalUrl(url: string): Promise<FileEntity | null>;
}