import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { RedisService } from 'src/commons/redis/redis.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private redisService: RedisService,
    private authService: AuthService,
  ) {}

  public async getUserById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  public async getUserByName(name: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { name } });
  }

  public async signin(name: string): Promise<any> {
    try {
      const user = await this.getUserByName(name);

      if (!user) {
        throw new BadRequestException();
      }

      const { id } = user;
      const payload = { sub: String(id) };

      const accessToken = await this.authService.createAccessToken(payload);
      const refreshToken = await this.authService.createRefreshToken(payload);

      await this.redisService.set(`redis-access-${payload.sub}`, accessToken, {
        ttl: 1000 * 60 * 30,
      });
      await this.redisService.set(
        `redis-refresh-${payload.sub}`,
        refreshToken,
        { ttl: 1000 * 60 * 60 * 24 * 14 },
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async signout(user): Promise<void> {
    try {
      await this.redisService.del(`redis-access-${user.id}`);
      await this.redisService.del(`redis-refresh-${user.id}`);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async createNewTokens(user): Promise<any> {
    try {
      const { id } = user;
      const payload = { sub: String(id) };

      const accessToken = await this.authService.createAccessToken(payload);
      const refreshToken = await this.authService.createRefreshToken(payload);

      await this.redisService.set(`redis-access-${user.id}`, accessToken, {
        ttl: 1000 * 60 * 30,
      });
      await this.redisService.set(`redis-refresh-${user.id}`, refreshToken, {
        ttl: 1000 * 60 * 60 * 24 * 14,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
