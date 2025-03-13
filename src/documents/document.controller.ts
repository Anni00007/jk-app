import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Controller, Post } from '@nestjs/common';
import { DocumentService } from './document.service';

@ApiTags('Documents')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload document',
  })
  @Post()
  async upload() {}
}
