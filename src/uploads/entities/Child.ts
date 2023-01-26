import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('children_details')
export class Child {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Column()
  ChildName: string;
  @Column()
  age: number;
  @Column()
  gender: string;
  @Column()
  contactNumber: string;
  @Column()
  LocationOfChild: string;
  @Column()
  descriptionOfChild: string;
  @Column()
  imageOfChild: string;
  @Column()
  status:string;
}
