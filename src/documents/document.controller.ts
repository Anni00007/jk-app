import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';
import { JoiValidationPipe } from 'src/utils/joi-validation.interface';
import { ResponseService } from 'src/response/response.service';
import { GetByIdParamDto, getByIdParamSchema } from './document.dto';

@ApiTags('Documents')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload a file',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, './assets');
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const fileName = Date.now() + ext;
          cb(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('File is required.');
      }
      return this.documentService.uploadFile(file);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get file by id',
  })
  @Get(':id')
  @UsePipes(new JoiValidationPipe(getByIdParamSchema, 'param'))
  async getFile(@Param() getByIdParamDto: GetByIdParamDto) {
    const file = await this.documentService.getFile(getByIdParamDto);
    return ResponseService.buildResponse(file);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'delete file by id',
  })
  @Delete(':id')
  @UsePipes(new JoiValidationPipe(getByIdParamSchema, 'param'))
  async deleteFile(@Param() getByIdParamDto: GetByIdParamDto) {
    const file = await this.documentService.deleteFile(getByIdParamDto);
    return ResponseService.buildResponse(file);
  }
}
