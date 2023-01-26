import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) 
              private userRepository:Repository<User>,
              private jwtService : JwtService
  ){}


  async create(createUserDto:CreateUserDto):Promise<User>{
    const user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.fullName = createUserDto.fullName;
    user.type = "user";
    console.log(user);
    try{
      const res = await this.userRepository.save(user);
      console.log(" Error ");
      console.log(res);
      return res;

    }catch(err){
      console.log("///////////////..........Error............//////////////")
      console.log(err.errno);
      if(err.errno === 1062){
        console.log("///////////////..........Error  Duplicate............//////////////")
        throw new BadRequestException("Email/User Already Exists"); 
         
      }
      throw new BadRequestException(err.sqlMessage);
    }
    // if(!req.user){
    //   return 'no user from google';
    // }else{
    //   console.log(req.user);
    //   return req.user;

    // }
    

  }

  async login(cred :{email:string,password:string}):Promise<any>{
    console.log(cred.email);
    const user = await this.userRepository.find({
      where : {
        email:cred.email
      }
    });
    const all = await this.userRepository.find();
    console.log("all",all);
    console.log("user = ",user);
    if(user.length !== 0){
      console.log("user = ",user[0])
      if(user[0].password === cred.password){
          console.log(user[0].fullName,user[0].id);
          const payload = {name:user[0].fullName , email:user[0].email , id:user[0].id, type:user[0].type};
          const access_token = await this.jwtService.signAsync(payload)
          return {access_token,fullName:user[0].fullName,email:user[0].email,id:user[0].id,type:user[0].type}
      }else{
        throw new BadRequestException("Email or Password Wrong");
      }
    }else{
      throw new BadRequestException("No User Found");
    }
    

    
    
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
