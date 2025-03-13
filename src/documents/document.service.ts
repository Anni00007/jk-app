import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetByIdParamDto } from './document.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  constructor(private prismaService: PrismaService) {}

  async uploadFile(file: Express.Multer.File) {
    try {
      const document = await this.prismaService.document.create({
        data: {
          fileName: file.filename,
          filePath: `/assets/${file.filename}`,
          url: `http://localhost:3000/assets/${file.filename}`,
        },
      });

      return document;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getFile(getByIdParamDto: GetByIdParamDto) {
    try {
      const document = await this.prismaService.document.findUnique({
        where: { id: getByIdParamDto.id },
      });
      return document;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteFile(getByIdParamDto: GetByIdParamDto) {
    try {
      const document = await this.prismaService.document.findUnique({
        where: { id: getByIdParamDto.id },
      });

      if (!document) {
        throw new Error('File not found');
      }

      const filePath = path.join(__dirname, '..', 'assets', document.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await this.prismaService.document.delete({
        where: { id: getByIdParamDto.id },
      });

      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
