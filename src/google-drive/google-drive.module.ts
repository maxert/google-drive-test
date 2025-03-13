import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';

@Module({
  exports: [GoogleDriveService],
  providers: [GoogleDriveService]
})
export class GoogleDriveModule {}
