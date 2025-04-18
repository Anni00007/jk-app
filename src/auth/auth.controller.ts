import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Body, Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorators';
import { ResponseService } from 'src/common/response/response.service';
import { JoiValidationPipe } from 'src/common/utils/joi-validation.interface';
import {
  CreateUserDto,
  createUserSchema,
  LoginUserDto,
  loginUserSchema,
} from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: 'Creates a new user and returns authentication details',
  })
  @Post('/create')
  @UsePipes()
  @UsePipes(new JoiValidationPipe(createUserSchema, 'body'))
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.create(createUserDto);
    return ResponseService.buildResponse(
      `User with '${user}' created successfully`,
    );
  }

  @Public()
  @ApiOperation({
    summary: 'Login for existing user and returns token',
  })
  @Post('login')
  @UsePipes(new JoiValidationPipe(loginUserSchema, 'body'))
  async login(@Body() loginUserDto: LoginUserDto) {
    const data = await this.authService.login(loginUserDto);
    return ResponseService.buildResponse(data);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout Api',
  })
  @Post('logout')
  @UsePipes()
  logOut() {
    return ResponseService.buildResponse('User logout successfully');
  }
}
