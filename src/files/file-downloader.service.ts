import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Readable } from 'stream';

@Injectable()
export class FileDownloader {
    private readonly logger = new Logger(FileDownloader.name);

    async download(url: string): Promise<Readable> {
        try {
            this.logger.log(`Downloading file from: ${url}`);
            const response: AxiosResponse<Readable> = await axios.get(url, { responseType: 'stream' });
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to download file from ${url}`, error);
            throw new Error(`Could not download file from: ${url}`);
        }
    }
}
