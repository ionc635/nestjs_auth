import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import {
  JwtAccessAuthGuard,
  JwtRefreshAuthGuard,
} from 'src/commons/jwt/jwt.auth.guard';
import { Request, Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.getUserById(id);
  }

  @Post('signin')
  async signin(
    @Body('name') name: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { accessToken, refreshToken } = await this.userService.signin(name);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('signout')
  async signout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.clearCookie('refreshToken');
    return this.userService.signout(req.user);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async createNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { accessToken, refreshToken } =
      await this.userService.createNewTokens(req.user);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }
}
