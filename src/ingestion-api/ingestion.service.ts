import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class IngestionService {
  private readonly ingestionBaseUrl = 'http://localhost:3001/ingestion';
  constructor(private readonly httpService: HttpService) {}

  async triggerIngestion() {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.ingestionBaseUrl}/trigger`,
      );

      return response.data;
    } catch (error) {
      console.error('Error triggering ingestion:', error);
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
      console.error('Error fetching ingestion status:', error);
      throw new Error('Ingestion status not found');
    }
  }
}
