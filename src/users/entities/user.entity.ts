import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @Column({ type: 'timestamp' })
  created: Date;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255 })
  create_by: string;

  @IsNotEmpty()
  @Column({ type: 'timestamp' })
  last_updated: Date;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255 })
  last_update_by: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @IsPhoneNumber()
  @Column({ type: 'varchar', length: 20 })
  phone_number: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'text' })
  image_url: string;
}
