import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMissingDto } from './dto/createMisingDto';
import { Child } from './entities/Child';

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
        missingChild.status = 'missing';

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
}
