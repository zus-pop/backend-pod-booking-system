import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        user_id: id,
      },
      include: {
        role: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });
  }
}
