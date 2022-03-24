import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from 'src/commons/jwt/jwt.strategy';
import { RedisModule } from 'src/commons/redis/redis.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({}), forwardRef(() => UserModule), RedisModule],
  providers: [JwtAccessStrategy, JwtRefreshStrategy, AuthService],
  exports: [AuthService]
})
export class AuthModule {}
