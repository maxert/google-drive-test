export interface IGoogleDriveService {
    uploadByUrl(fileUrl: string): Promise<string>;
}
