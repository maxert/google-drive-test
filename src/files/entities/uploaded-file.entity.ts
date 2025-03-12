import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class UploadedFile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column({ unique: true })
    driveFileId: string;

    @Column()
    webViewLink: string;

    @Column()
    webContentLink: string;

    @CreateDateColumn()
    createdAt: Date;
}
