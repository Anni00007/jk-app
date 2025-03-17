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
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import {
  FileUploadInterceptor,
  FileValidationPipe,
  configuredFileInterceptor,
} from '../common/interceptors';
import { JoiValidationPipe } from 'src/common/utils/joi-validation.interface';
import { ResponseService } from 'src/common/response/response.service';
import { GetByIdParamDto, getByIdParamSchema } from './document.dto';
import { RolesGuard } from 'src/common/gaurds/role.gaurd';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleEnum } from '@prisma/client';

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
  @Roles(RoleEnum.ADMIN, RoleEnum.EDITOR)
  @UseInterceptors(configuredFileInterceptor, FileUploadInterceptor)
  async uploadFile(
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    const document = await this.documentService.uploadFile(file);
    return ResponseService.buildResponse(document);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get file by id',
  })
  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.VIEWER)
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
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new JoiValidationPipe(getByIdParamSchema, 'param'))
  async deleteFile(@Param() getByIdParamDto: GetByIdParamDto) {
    const file = await this.documentService.deleteFile(getByIdParamDto);
    return ResponseService.buildResponse(file);
  }
}
