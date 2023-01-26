import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {AuthGuard} from '@nestjs/passport'
import { LocalAuthGuard } from './local.auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('/login')
  // @UseGuards(AuthGuard('google'))
  // create(@Req() req) {
  //   console.log('/login');
  // }

  // @Get('auth/google/callback')
  // @UseGuards(AuthGuard('google'))
  // googleRedirect(@Req() req){
  //   return this.usersService.create(req);
  // }

  @Post('/login')
  // @UseGuards(LocalAuthGuard)
  login(@Body() user:{email:string,password:string},@Req() req){
    console.log(user);
    console.log(req.user);
    return this.usersService.login(user);
  }

  @Post('/register')
  createUser(@Body() createUserDto:CreateUserDto){
    return this.usersService.create(createUserDto);
  }



  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}

