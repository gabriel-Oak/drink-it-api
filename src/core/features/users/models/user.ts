import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { compare, hash } from 'bcryptjs';
export interface UserProps {
  id?: string;
  name: string;
  email: string;
  username: string;
  password: string;
}

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column('text')
  public name!: string;

  @Column('text')
  public email!: string;

  @Column('text')
  public username!: string;

  @Column({
    type: 'text',
    nullable: true
  })
  public password?: string;

  constructor(props?: UserProps) {
    Object.assign(this, props);
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password!, 12);
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await compare(candidatePassword, hashedPassword);
  }
}
