import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { IGoogleDriveService } from './google-drive.interface';

@Module({
  providers: [
    {
      provide: 'IGoogleDriveService',
      useClass: GoogleDriveService,
    },
  ],
  exports: ['IGoogleDriveService'],
})
export class GoogleDriveModule {}
