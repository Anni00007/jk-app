import { Controller, Post, Get, Param } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Ingestion')
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'trigger ingestion process',
  })
  @Post('trigger')
  async triggerIngestion() {
    return this.ingestionService.triggerIngestion();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get ingestion status',
  })
  @Get('status/:ingestionId')
  async getIngestionStatus(@Param('ingestionId') ingestionId: string) {
    return this.ingestionService.getIngestionStatus(ingestionId);
  }
}
