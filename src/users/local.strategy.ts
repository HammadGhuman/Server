import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from './users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: UsersService) {
    super();
  }

  async validate(email: string, password: string) {
    const user = await this.authService.login({ email, password });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    return user;
  }
}
