import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMissingDto } from './dto/createMisingDto';
import { Child } from './entities/Child';
import * as fs from 'fs';
import * as path from 'node:path'
import { resolve } from 'path';
import { getInfoAsync } from 'expo-file-system';

@Injectable()
export class UploadsService {
    constructor(@InjectRepository(Child) private childRepository:Repository<Child>){}
    
    async reportMissingChild(createMissingDto:CreateMissingDto):Promise<Child>{
        const missingChild = new Child();
        missingChild.ChildName = createMissingDto.ChildName;
        missingChild.age = createMissingDto.age;
        missingChild.LocationOfChild = createMissingDto.LocationOfChild;
        missingChild.descriptionOfChild = createMissingDto.descriptionOfChild;
        missingChild.contactNumber = createMissingDto.contactNumber;
        missingChild.gender = createMissingDto.gender;
        missingChild.imageOfChild = createMissingDto.imageOfChild;
        missingChild.status = 'pending';

        try{
            return await this.childRepository.save(missingChild);
        }catch(err){
            console.log(err)
            throw new InternalServerErrorException('error');
        }
    }

    async reportFoundChild(createMissingDto:CreateMissingDto):Promise<Child>{
        const foundChild = new Child();
        foundChild.ChildName = createMissingDto.ChildName;
        foundChild.age = createMissingDto.age;
        foundChild.LocationOfChild = createMissingDto.LocationOfChild;
        foundChild.descriptionOfChild = createMissingDto.descriptionOfChild;
        foundChild.contactNumber = createMissingDto.contactNumber;
        foundChild.gender = createMissingDto.gender;
        foundChild.imageOfChild = createMissingDto.imageOfChild;
        foundChild.status = 'found';
        try{
            return await this.childRepository.save(foundChild);
        }catch(err){
            console.log(err)
            throw new InternalServerErrorException('error');
        }
    }

    async deleteRequest(id:string){
        try{
            console.log('service')
            const record = await this.childRepository.find({
                where:{
                    'id':id
                }
            });
            console.log(record);
            fs.promises.unlink(record[0].imageOfChild);
            return await this.childRepository.delete(id)
        }catch(err){
            console.log(err)
            throw new BadRequestException('err ');
        }
    }  
    
    async getFoundRequest(){
        try{
            const res = await this.childRepository.find({
                where:{
                    'status':'found'
                }
            })
            res.map(async(item)=>{
                item.imageOfChild = resolve(item.imageOfChild);
                const fileBuffer = fs.readFileSync(item.imageOfChild);
                const fileType = item.imageOfChild.split('.').pop();
                const dataUri = `data:image/${fileType};base64,${fileBuffer.toString('base64')}`;
                item.imageOfChild = dataUri;
            })  
            // console.log(res);
            return res;
        }catch(err){
            throw new BadRequestException(err);
        }
    }

    async getMissingRequest(){
        try{
            const res = await this.childRepository.find({
                where:{
                    'status':'missing'
                }
            })
            res.map(async(item)=>{
                item.imageOfChild = resolve(item.imageOfChild);
                const fileBuffer = fs.readFileSync(item.imageOfChild);
                const fileType = item.imageOfChild.split('.').pop();
                const dataUri = `data:image/${fileType};base64,${fileBuffer.toString('base64')}`;
                item.imageOfChild = dataUri;
            })  
            // console.log(res);
            return res;
        }catch(err){
            throw new BadRequestException(err);
        }
    }

    async getPendingRequest(){
        try{
            const res = await this.childRepository.find({
                where:{
                    'status':'pending'
                }
            })
            // console.log(res);
            res.map(async(item)=>{
                item.imageOfChild = resolve(item.imageOfChild);
                const fileBuffer = fs.readFileSync(item.imageOfChild);
                const fileType = item.imageOfChild.split('.').pop();
                const dataUri = `data:image/${fileType};base64,${fileBuffer.toString('base64')}`;
                item.imageOfChild = dataUri;
            })  
            // console.log(res);
            return res;
        }catch(err){
            throw new BadRequestException(err);
        }
    }

    async AproveRequest(id:string){
        try{
            const record = await this.childRepository.find({
                where:{
                    'id':id
                }
            });
            const {ChildName,LocationOfChild,age,contactNumber,descriptionOfChild,gender,imageOfChild,status} = record[0]
            const absolutePath = path.resolve(record[0].imageOfChild);
            const img = record[0].imageOfChild.split('/');
            img[0] = 'missingChildren'
            // console.log(img);
            const dest = path.resolve(img.join('/'));
            // console.log(absolutePath);
            // console.log(dest);
            const newRec = await this.childRepository.save({
                ChildName,
                LocationOfChild,
                age,
                contactNumber,
                descriptionOfChild,
                gender,
                imageOfChild:img.join('/'),
                status:"missing"
            })
            console.log('id =========' ,id);
            fs.promises.rename(absolutePath,dest);
            console.log('del');
            const del = await this.childRepository.createQueryBuilder('children_details').delete().from(Child).where("id = :id",{id:id}).execute();
            return {
                newRec,del
            };
        }
        catch(err){
            console.log(err);
            throw new BadRequestException(err);
        }
    }


    async foundRequest(id:string){
        try{
            const record = await this.childRepository.find({
                where:{
                    'id':id
                }
            });
            console.log(record[0]);
            const {ChildName,LocationOfChild,age,contactNumber,descriptionOfChild,gender,imageOfChild,status} = record[0]
            const absolutePath = path.resolve(record[0].imageOfChild);
            const img = record[0].imageOfChild.split('/');
            img[0] = 'foundChildren'
            console.log(img);
            const dest = path.resolve(img.join('/'));
            console.log(absolutePath);
            console.log(dest);
            const newRec = await this.childRepository.save({
                ChildName,
                LocationOfChild,
                age,
                contactNumber,
                descriptionOfChild,
                gender,
                imageOfChild:img.join('/'),
                status:"found"
            })
            fs.promises.rename(absolutePath,dest);
            const del = await this.childRepository.delete(id)
            return {
                newRec,del
            };
        }
        catch(err){
            throw new BadRequestException(err);
        }
    }
}
