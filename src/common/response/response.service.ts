import { Injectable } from '@nestjs/common';

export interface IApiResponse<T> {
  data: T;
  message?: string;
}

@Injectable()
export class ResponseService {
  constructor() {}

  static buildResponse<T>(data: T, message = 'Success'): IApiResponse<T> {
    return {
      data,
      message,
    };
  }
}
