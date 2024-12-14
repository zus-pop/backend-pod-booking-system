import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto';

@Injectable()
export class AuthService {
  private readonly SALT: number = 8;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const isValidPassword = await bcrypt.compare(pass, user.password);
    if (!isValidPassword) {
      throw new BadRequestException('Invalid password');
    }

    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role,
    };

    const token = this.signToken(payload);

    return {
      access_token: token,
    };
  }

  signToken(payload: Buffer | object) {
    return this.jwtService.sign(payload);
  }
}
