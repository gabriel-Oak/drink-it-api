import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({
    type: 'text',
    unique: true
  })
  public name!: string;

  @Column({
    type: 'text',
    unique: true
  })
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
  @BeforeUpdate()
  async hashPassword() {
    if (this.password &&
      !this.password.includes('$2a$12$') &&
      this.password.length < 60
    ) {
      this.password = await hash(this.password + JWT_SECRET, 12);
    }
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

  updateProps(props: Partial<Omit<UserProps, 'id'>>) {
    Object.assign(this, {
      name: props.name ?? this.name,
      username: props.username ?? this.username,
      email: props.email ?? this.email
    });
  }
}
