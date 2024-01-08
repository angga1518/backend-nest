import { Entity, Column } from 'typeorm';
import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';
import { BaseEntity } from 'src/utils/entity/base.entity';

@Entity()
export class User extends BaseEntity {
  @IsEmail()
  @IsNotEmpty()
  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @IsNotEmpty()
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @IsPhoneNumber()
  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'image_url', type: 'text' })
  imageUrl: string;

  @Column({ name: 'npm', type: 'varchar', length: 50 })
  npm: string;

  @Column({ name: 'role', type: 'varchar', length: 25 })
  role: string;

  @Column({ name: 'join_year', type: 'integer' })
  joinYear: number;

  @Column({ name: 'join_term', type: 'integer' })
  joinTerm: number;

  @Column({ name: 'fcm_token', type: 'varchar', length: 255, nullable: true })
  fcmToken: string | null;
}
