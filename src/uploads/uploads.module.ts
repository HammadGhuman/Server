import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { Child } from './entities/Child';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports : [TypeOrmModule.forFeature([Child])],
  controllers: [UploadsController],
  providers: [UploadsService,TypeOrmModule]
})
export class UploadsModule {}
