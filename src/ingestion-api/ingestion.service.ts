import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);
  private readonly ingestionBaseUrl = 'http://localhost:3001/ingestion';
  constructor() {}

  async triggerIngestion() {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.ingestionBaseUrl}/trigger`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Ingestion process could not be triggered');
    }
  }

  async getIngestionStatus(ingestionId: string) {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.ingestionBaseUrl}/status/${ingestionId}`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Ingestion status not found');
    }
  }
}
