import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
 @PrimaryGeneratedColumn('uuid')
 id : number;

 @Column({unique:true,nullable:false})
 email : string;

 @Column()
 password : string

 @Column()
 fullName : string;

 @Column({default:"user"})
 type : string;
}
