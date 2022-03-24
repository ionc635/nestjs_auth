import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from './user/user.entity';

export const TypeOrmConfig = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'mysql',
    host: configService.get('DATABASE_HOST'),
    port: +configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    synchronize: process.env.NODE_ENV !== 'prod',
    autoLoadEntities: process.env.NODE_ENV !== 'prod',
    logging: process.env.NODE_ENV !== 'prod',
    keepConnectionAlive: true,
    entities: [UserEntity],
  }),
  inject: [ConfigService],
};