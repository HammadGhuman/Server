import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class PendingRequest{
    @PrimaryGeneratedColumn('uuid')
    requestId:string;

    @Column()
    imagepath:string;
}