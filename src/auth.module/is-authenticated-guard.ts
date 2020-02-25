import { CanActivate, ExecutionContext } from '@nestjs/common';

export class IsAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    return !!user;
  }
}
