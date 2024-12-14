import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  access_token: string;
  refresh_token?: string;
}

export class Payload {
  sub: number;
  email: string;
  role: {
    role_id: number;
    role_name: string;
  };
}
