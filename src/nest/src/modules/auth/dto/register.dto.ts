import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsPhoneNumber('VN', {
    message: 'The phone number is not valid',
  })
  @IsNotEmpty()
  phone_number: string;

  @IsNumber()
  @IsOptional()
  role_id?: number;
}
