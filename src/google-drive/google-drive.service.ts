import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { google } from 'googleapis';
import { IGoogleDriveService } from './google-drive.interface';
import * as path from 'path';

@Injectable()
export class GoogleDriveService implements IGoogleDriveService {
    private driveClient;

    constructor() {
        const auth = new google.auth.GoogleAuth({
           keyFile: path.join(process.cwd(), 'client_secret.json'),
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        this.driveClient = google.drive({ version: 'v3', auth });
    }

    async uploadByUrl(fileUrl: string): Promise<string> {
        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream',
        });

        const { data } = await this.driveClient.files.create({
            media: {
                mimeType: response.headers['content-type'] || 'application/octet-stream',
                body: response.data,
            },
            requestBody: {
                name: this.extractFileName(fileUrl),
            },
            fields: 'id, webViewLink, webContentLink',
        });

        return data.webViewLink || data.webContentLink;
    }

    private extractFileName(url: string): string {
        return url.split('/').pop() || `file-${Date.now()}`;
    }
}
