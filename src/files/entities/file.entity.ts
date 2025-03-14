import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index} from 'typeorm';

export enum FileStatus {
    PENDING = 'pending',
    UPLOADING = 'uploading',
    DONE = 'done',
    ERROR = 'error',
}

@Index(['originalUrl'], { unique: true })
@Entity('files')
export class FileEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false, type: 'text' })
    public originalUrl: string;

    @Column({ nullable: true, type: 'text' })
    public driveLink: string | null;

    @Column({
        type: 'enum',
        enum: FileStatus,
        default: FileStatus.PENDING,
    })
    public status: FileStatus;

    @CreateDateColumn()
    public createdAt: Date;
}
