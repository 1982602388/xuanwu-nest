import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MoreMessage } from './moreMessage.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => MoreMessage, (moreMessage) => moreMessage.product, {
    cascade: true,
  })
  moreMessage: MoreMessage[];
}
