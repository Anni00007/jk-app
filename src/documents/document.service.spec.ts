import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { Logger } from '@nestjs/common';

jest.mock('fs');
jest.mock('path');

describe('DocumentService', () => {
  let documentService: DocumentService;
  let prismaService: PrismaService;

  const mockLogger = {
    error: jest.fn(),
  };

  const mockPrismaService = {
    document: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    destination: './uploads',
    filename: 'test-123.pdf',
    path: '/uploads/test-123.pdf',
    size: 12345,
    buffer: Buffer.from('test'),
    stream: Readable.from(Buffer.from('test')),
  };

  const mockDocument = {
    id: 1,
    fileName: 'test-123.pdf',
    filePath: '/assets/test-123.pdf',
    url: 'http://localhost:3000/assets/test-123.pdf',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    documentService = module.get<DocumentService>(DocumentService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload a file and create a document record', async () => {
      mockPrismaService.document.create.mockResolvedValue(mockDocument);

      const result = await documentService.uploadFile(mockFile);

      expect(result).toEqual(mockDocument);
      expect(mockPrismaService.document.create).toHaveBeenCalledWith({
        data: {
          fileName: mockFile.filename,
          filePath: `/assets/${mockFile.filename}`,
          url: `http://localhost:3000/assets/${mockFile.filename}`,
        },
      });
    });

    it('should handle upload errors', async () => {
      const error = new Error('Upload failed');
      mockPrismaService.document.create.mockRejectedValue(error);

      await expect(documentService.uploadFile(mockFile)).rejects.toThrow(error);
    });
  });

  describe('getFile', () => {
    it('should return a file by id', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(mockDocument);

      const result = await documentService.getFile({ id: 1 });

      expect(result).toEqual(mockDocument);
      expect(mockPrismaService.document.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should handle file not found', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(null);

      const result = await documentService.getFile({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('deleteFile', () => {
    it('should delete a file and its document record', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(mockDocument);
      mockPrismaService.document.delete.mockResolvedValue(mockDocument);
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);
      (path.join as jest.Mock).mockReturnValue('/full/path/to/file.pdf');

      const result = await documentService.deleteFile({ id: 1 });

      expect(result).toBe(true);
      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(mockPrismaService.document.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw error if file not found', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(null);

      await expect(documentService.deleteFile({ id: 999 })).rejects.toThrow(
        'File not found',
      );
    });

    it('should handle file deletion errors', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(mockDocument);
      const error = new Error('Deletion failed');
      mockPrismaService.document.delete.mockRejectedValue(error);

      await expect(documentService.deleteFile({ id: 1 })).rejects.toThrow(
        error,
      );
    });

    it('should skip file system deletion if file does not exist', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(mockDocument);
      mockPrismaService.document.delete.mockResolvedValue(mockDocument);
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = await documentService.deleteFile({ id: 1 });

      expect(result).toBe(true);
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });
  });
});
