import { JwtPayload } from './jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtAccessExtractor, jwtRefreshExtractor } from './jwt.extractor';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtAccessExtractor]),
      secretOrKey: configService.get('ACCESS_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: JwtPayload) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const user = this.userService.getUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('유저 정보가 존재하지 않습니다.');
    }

    const storedAccessToken = await this.redisService.get(
      `redis-access-${payload.sub}`,
    );

    if (accessToken !== storedAccessToken) {
      throw new UnauthorizedException('액세스 토큰이 일치하지 않습니다.');
    }

    return user;
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtRefreshExtractor]),
      secretOrKey: configService.get('REFRESH_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: JwtPayload) {
    const refreshToken = req.cookies.refreshToken;
    const user = this.userService.getUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('유저 정보가 존재하지 않습니다.');
    }

    const storedRefreshToken = await this.redisService.get(
      `redis-refresh-${payload.sub}`,
    );

    if (refreshToken !== storedRefreshToken) {
      throw new UnauthorizedException('리프래쉬 토큰이 일치하지 않습니다.');
    }
    return user;
  }
}
