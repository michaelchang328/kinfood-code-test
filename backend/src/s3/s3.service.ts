import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION,
    });
  }

  async upload(file: Express.Multer.File): Promise<S3.ManagedUpload.SendData> {
    const params: S3.PutObjectRequest = {
      Bucket: `${process.env.AWS_S3_BUCKET}`,
      Key: `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`,
      Body: file.buffer,
      ACL: 'bucket-owner-full-control',
      ContentEncoding: 'base64',
    };

    return new Promise(async (resolve, reject) => {
      try {
        this.s3.upload(
          params,
          (err: Error, data: S3.ManagedUpload.SendData) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          },
        );
      } catch (e) {
        reject(e);
      }
    });
  }
}
