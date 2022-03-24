import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';

export const jwtAccessExtractor: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const accessToken = request.header('Authorization').split(' ')[1];
    return accessToken;
  } catch (error) {
    throw new UnauthorizedException('인증되지 않은 사용자입니다.');
}
};

export const jwtRefreshExtractor: JwtFromRequestFunction = (
  request: Request,
): string | null => {
  try {
    const refreshToken = request.cookies.refreshToken;
    return refreshToken;
  } catch (error) {
    throw new UnauthorizedException('인증되지 않은 사용자입니다.');
  }
};
