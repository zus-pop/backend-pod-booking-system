import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Profile } from '../dto';

export const GetMe = createParamDecorator<keyof Profile>(
  (data: keyof Profile, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user[data] : user;
  },
);
