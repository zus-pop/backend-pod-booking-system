import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetMe } from './decorators';
import { LoginRequestDto, LoginResponseDto, Payload, Profile } from './dto';
import { RegisterRequestDto } from './dto/register.dto';
import { JwtGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginRequestDto,
  })
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'Return the access token',
  })
  @ApiBadRequestResponse({
    description: 'Invalid email or password',
  })
  //   @UseGuards(LocalGuard)
  login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.validateUser(
      loginRequestDto.email,
      loginRequestDto.password,
    );
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: RegisterRequestDto,
  })
  @ApiCreatedResponse({
    type: Payload,
    description: 'Register successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
  })
  register(@Body() registerRequestDto: RegisterRequestDto) {
    return registerRequestDto;
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Payload,
    description: 'Return the user information',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtGuard)
  getMe(@GetMe() user: Profile) {
    return user;
  }
}
