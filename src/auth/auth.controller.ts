import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Creates a new user and returns authentication details',
  })
  @Post('/')
  @UsePipes()
  async createUser() {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Login for existing user and returns token',
  })
  @Post('login')
  @UsePipes()
  async login() {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout Api',
  })
  @Post('logout')
  @UsePipes()
  async logOut() {}
}
