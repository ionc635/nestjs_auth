import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/commons/jwt/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async createAccessToken(payload: JwtPayload) {
    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('ACCESS_SECRET'),
        expiresIn: this.configService.get('ACCESS_EXPIRE'),
      });
      return accessToken;
    } catch (error) {
      throw new InternalServerErrorException('서버 오류');
    }
  }

  public async createRefreshToken(payload: JwtPayload) {
    try {
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('REFRESH_SECRET'),
        expiresIn: this.configService.get('REFRESH_EXPIRE'),
      });
      return refreshToken;
    } catch (err) {
      throw new InternalServerErrorException('서버 오류');
    }
  }
}
