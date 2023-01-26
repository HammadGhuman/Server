import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { InjectRepository } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import path from 'path';
import { JwtAuthGuard } from 'src/users/jwt.auth.guard';
import { CreateMissingDto } from './dto/createMisingDto';

import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {
    
  }


  @Post('/missing')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file',{
    storage : diskStorage({
      destination : "./missingChildren",
      filename : (req,file,cb)=>{
        const name = file.originalname.split(".")[0];
        const fileExtension = file.originalname.split(".")[1];
        let date = new Date();
        let dateStr = date.toLocaleDateString();
        let dateTime = date.toLocaleTimeString()
        const us = req.user;
        const newFileName = name.split(" ").join("_") + "_" +(us as any).email+"_" + dateStr.split("/")[0] + "#" +  dateStr.split("/")[1] + "#" + dateStr.split("/")[2] +"_" + dateTime + "_" + fileExtension;
        console.log(newFileName);
        cb(null,newFileName);
      }
    })
  }))
  reportMissingChild(@UploadedFile() file:Express.Multer.File,@Body() createMissingDto:CreateMissingDto,@Req() req){
    console.log(req.user)
    createMissingDto.imageOfChild = file.destination;
    console.log(file);
    return this.uploadsService.reportMissingChild(createMissingDto);
  }


  @Post('/found')
  @UseInterceptors(FileInterceptor('file',{
    storage : diskStorage({
      destination : "./foundChildren",
      filename : (req,file,cb)=>{
        const name = file.originalname.split(".")[0];
        const fileExtension = file.originalname.split(".")[1];
        let date = new Date();
        let dateStr = date.toLocaleDateString();
        let dateTime = date.toLocaleTimeString()

        const newFileName = name.split(" ").join("_") + "_" + dateStr.split("/")[0] + "#" +  dateStr.split("/")[1] + "#" + dateStr.split("/")[2] +"_" + dateTime + "_" + fileExtension;
        console.log(newFileName);
        cb(null,newFileName);
      }
    })
  }))
  reportFoundChild(@UploadedFile() file:Express.Multer.File,@Body() createMissingDto:CreateMissingDto){
    createMissingDto.imageOfChild = file.destination;
    console.log(file);
    return this.uploadsService.reportFoundChild(createMissingDto);
  }


}
