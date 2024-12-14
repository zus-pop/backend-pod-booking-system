import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudStorage } from './cloud.interface';

@Injectable()
export class GoogleCloudService
  extends Storage
  implements CloudStorage, OnModuleInit
{
  private bucketName: Bucket;
  private readonly baseImageUrl = 'https://storage.googleapis.com';

  constructor(private readonly config: ConfigService) {
    super({
      projectId: config.get<string>('GOOGLE_CLOUD_PROJECT_ID'),
      credentials: {
        client_email: config.get<string>('GOOGLE_CLOUD_CLIENT_EMAIL'),
        private_key: config
          .get<string>('GOOGLE_CLOUD_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
      },
    });
  }

  onModuleInit() {
    this.bucketName = this.bucket(
      this.config.get<string>('GOOGLE_CLOUD_BUCKET_NAME'),
    );
  }

  letImageCookToCloud(
    imageFile: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!imageFile) {
        reject(new Error('No image file provided'));
      }

      const blob = this.bucketName.file(
        `${folder}/${imageFile.originalname.replace(/[\s-]/g, '_')}`,
      );
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on('error', (err) => {
        reject('Error uploading go Google Cloud Storage' + err);
      });

      blobStream.on('finish', () => {
        const publicUrl = `${this.baseImageUrl}/${this.bucketName.name}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(imageFile.buffer);
    });
  }
}
