import {drive_v3, google} from "googleapis";
import * as path from "path";
import {Injectable} from "@nestjs/common";
import {Readable} from "stream";

@Injectable()
export class GoogleDriveService {
    private driveClient: drive_v3.Drive;
    constructor() {
        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(process.cwd(), 'client_secret.json'),
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        this.driveClient = google.drive({version: 'v3', auth});
    }

    async uploadFile(fileStream: Readable, fileName: string) {
        const response = await this.driveClient.files.create({
            requestBody: {name: fileName},
            media: {body: fileStream},
            fields: 'id,webViewLink,webContentLink',
        });
        return response.data;
    }
}
