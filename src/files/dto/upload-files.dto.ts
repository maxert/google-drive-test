import { IsArray, IsUrl, ArrayNotEmpty } from 'class-validator';

export class UploadFilesDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsUrl({}, { each: true })
    urls: string[];
}
