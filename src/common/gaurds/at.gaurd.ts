import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const url = request.url;

    if (this.isPublicRoute(url) || isPublic) {
      return true;
    }

    return (await super.canActivate(context)) as boolean;
  }

  private isPublicRoute(url: string): boolean {
    const publicRoutes = ['/auth/login', '/auth/create'];
    return publicRoutes.includes(url);
  }
}
