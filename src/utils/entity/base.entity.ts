import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @Column({ name: 'created', type: 'timestamp' })
  created: Date;

  @IsNotEmpty()
  @Column({ name: 'create_by', type: 'varchar', length: 255 })
  createBy: string;

  @IsNotEmpty()
  @Column({ name: 'last_updated', type: 'timestamp' })
  lastUpdated: Date;

  @IsNotEmpty()
  @Column({ name: 'last_update_by', type: 'varchar', length: 255 })
  lastUpdateBy: string;

  @IsNotEmpty()
  @Column({ name: 'record_flag', type: 'boolean', default: true })
  recordFlag: boolean;
}
