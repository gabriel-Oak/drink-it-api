import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { JWT_SECRET } from '../../../utils/constants';
export interface UserProps {
  id?: string;
  name: string;
  email: string;
  username: string;
  password?: string;
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
    this.password = await hash(this.password! + JWT_SECRET, 12);
  }

  async comparePasswords(candidatePassword: string) {
    if (!this.password) return false;
    return await compare(candidatePassword + JWT_SECRET, this.password);
  }

  getProps() {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      email: this.email
    }
  }
}
