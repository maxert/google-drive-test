import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFilesRepository } from './IFilesRepository';
import {FileEntity} from "../entities/file.entity";

@Injectable()
export class TypeOrmFilesRepository implements IFilesRepository {
    constructor(
        @InjectRepository(FileEntity)
        private readonly repo: Repository<FileEntity>,
    ) {}

    async save(entities: FileEntity[]): Promise<FileEntity[]> {
        return this.repo.save(entities);
    }

    async update(id: number, partial: Partial<FileEntity>): Promise<void> {
        await this.repo.update(id, partial);
    }

    async find(): Promise<FileEntity[]> {
        return this.repo.find();
    }
    async findByOriginalUrl(url: string): Promise<FileEntity | null> {
        return this.repo.findOne({
            where: { originalUrl: url },
        });
    }
}
