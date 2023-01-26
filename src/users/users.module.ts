import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GoogleStrategy } from './google.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports : [TypeOrmModule.forFeature([User]),JwtModule.register({
    secret: "jwtSecret", // TODO store it in env file
    signOptions: {expiresIn : '3600s'}
  })],
  controllers: [UsersController],
  providers: [UsersService,TypeOrmModule,GoogleStrategy,JwtStrategy,LocalStrategy],
  exports : [UsersService,JwtStrategy]
})
export class UsersModule {}
