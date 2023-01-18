import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Measure from './measure';

@Entity()
export default class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ unique: true })
  public name!: string;

  @OneToMany(() => Measure, (cocktail) => cocktail.data)
  public cocktails?: Measure[];

  constructor(props?: Ingredient) {
    Object.assign(this, props);
  }
}
