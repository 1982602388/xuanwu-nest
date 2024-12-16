import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  openid: string;

  @Column()
  nickname: string;

  @Column()
  avatarUrl: string;

  @Column()
  phone: string;

  // 其他用户信息字段
}
