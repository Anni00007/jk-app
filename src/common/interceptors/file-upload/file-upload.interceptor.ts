import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import * as multer from 'multer';
import * as path from 'path';
import { fileUploadConfig } from './file-upload.config';

export const configuredFileInterceptor = FileInterceptor('file', {
  storage: multer.diskStorage({
    destination: fileUploadConfig.destination,
    filename: (req, file, cb) => {
      try {
        const ext = path.extname(file.originalname);
        const fileName = Date.now() + ext;
        cb(null, fileName);
      } catch (error) {
        cb(error as Error, '');
      }
    },
  }),
  fileFilter: (req, file, cb) => {
    try {
      if (!fileUploadConfig.allowedMimeTypes.includes(file.mimetype)) {
        return cb(
          new BadRequestException(
            `Invalid file type. Allowed types: ${fileUploadConfig.allowedMimeTypes.join(', ')}`,
          ),
          false,
        );
      }

      if (!fileUploadConfig.allowedFileNamePattern.test(file.originalname)) {
        return cb(
          new BadRequestException(
            'Invalid file name. Only alphanumeric characters, hyphens, underscores, and spaces are allowed.',
          ),
          false,
        );
      }

      return cb(null, true);
    } catch (error) {
      return cb(error as Error, false);
    }
  },
  limits: {
    fileSize: fileUploadConfig.maxSize,
  },
});

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FileUploadInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.logger.log(`Processing file upload request from: ${request.ip}`);

    return next.handle();
  }
}
