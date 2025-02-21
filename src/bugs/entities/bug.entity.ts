import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BugStatus } from '../enums/bug_status.enum';

export { BugStatus };
@Entity()
export class Bug {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  date: Date;

  @Column({ type: 'int' })
  severity: number;

  @Column({
    type: 'enum',
    enum: BugStatus,
    default: BugStatus.TODO,
  })
  status: BugStatus;
}
