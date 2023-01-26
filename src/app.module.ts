import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'hammad',
      database: 'missing',
      entities: [User],
      synchronize: true,
      autoLoadEntities:true
  }),
    UsersModule,
    UploadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
