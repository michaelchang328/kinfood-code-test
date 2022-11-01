import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export enum Role {
  normal_user = 'normal_user',
  editor = 'editor',
  super_admin = 'super_admin',
}

export interface IUser {
  user_id: string;
  role: Role;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IUser;
  },
);
