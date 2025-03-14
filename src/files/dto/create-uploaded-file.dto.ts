import { IsArray, IsString } from 'class-validator';

export class CreateUploadedFileDto {
    @IsArray()
    @IsString({ each: true })
    urls: string[];
}
