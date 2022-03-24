import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  
  @Injectable()
  export class JwtAccessAuthGuard extends AuthGuard('jwt-access') {
    canActivate(context: ExecutionContext) {
      return super.canActivate(context);
    }
  
    handleRequest(err: any, user: any, info: any) {
      if (err || !user) {
        throw (
          err || new UnauthorizedException('엑세스 토큰이 유효하지 않습니다.')
        );
      }

      console.log(user)
      return user;
    }
  }
  
  @Injectable()
  export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
    canActivate(context: ExecutionContext) {
      return super.canActivate(context);
    }
  
    handleRequest(err: any, user: any, info: any) {
      if (err || !user) {
        throw (
          err || new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.')
        );
      }
      return user;
    }
  }
  