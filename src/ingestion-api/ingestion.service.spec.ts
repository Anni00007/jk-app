import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('IngestionService', () => {
  let ingestionService: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3001/ingestion'),
          },
        },
      ],
    }).compile();

    ingestionService = module.get<IngestionService>(IngestionService);

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  describe('triggerIngestion', () => {
    it('should successfully trigger ingestion', async () => {
      const mockResponse = { data: { ingestionId: '123', status: 'started' } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await ingestionService.triggerIngestion();

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/ingestion/trigger',
      );
    });

    it('should handle errors when triggering ingestion', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

      await expect(ingestionService.triggerIngestion()).rejects.toThrow(
        'Ingestion process could not be triggered',
      );
    });
  });

  describe('getIngestionStatus', () => {
    it('should successfully get ingestion status', async () => {
      const mockResponse = { data: { status: 'completed' } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await ingestionService.getIngestionStatus('123');

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3001/ingestion/status/123',
      );
    });

    it('should handle errors when getting ingestion status', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Not Found'));

      await expect(ingestionService.getIngestionStatus('123')).rejects.toThrow(
        'Ingestion status not found',
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
