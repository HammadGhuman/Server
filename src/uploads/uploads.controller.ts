import { Body, Controller, Delete, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { InjectRepository } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import {resolve} from 'node:path'
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
      destination : "./pendingRequests",
      filename : (req,file,cb)=>{
        console.log('file =========== ',file);
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
    console.log(req.body)
    console.log(req.file);
    createMissingDto.imageOfChild = file.path;
    return this.uploadsService.reportMissingChild(createMissingDto);
  }


  @Post('/found')
  @UseGuards(JwtAuthGuard)
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
    createMissingDto.imageOfChild = file.path;
    console.log(file);
    return this.uploadsService.reportFoundChild(createMissingDto);
  }


  @Delete()
  rejectRequest(@Body() body:{id:string}){
    console.log(body.id);
    return this.uploadsService.deleteRequest(body.id)
  }

  @Patch()
  aproveRequest(@Body() body:{id:string}){
    console.log(body.id);
    return this.uploadsService.AproveRequest(body.id);
  }

  @Patch('/foundRequest')
  foundRequest(@Body() body:{id:string}){
    console.log(body.id);
    return this.uploadsService.foundRequest(body.id);
  }


  @Get('/missing')
  getMissingRequest(){
    return this.uploadsService.getMissingRequest();
  }

  @Get('/found')
  getFoundRequest(){
    return this.uploadsService.getFoundRequest();
  }

  @Get('/pending')
  getPendingRequest(){
    return this.uploadsService.getPendingRequest();
  }
}
