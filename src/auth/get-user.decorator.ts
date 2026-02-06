import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();
  if (req.user) {
    return req.user;
  }
  throw new UnauthorizedException('Unauthorized');
});
