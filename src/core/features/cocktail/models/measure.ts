import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Cocktail from './cocktail';
import Ingredient from './ingredient';

@Entity()
export default class Measure {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @ManyToOne(() => Cocktail, (cocktail) => cocktail.measures)
  public cocktail?: Cocktail;

  @Column({
    nullable: true
  })
  public measure?: string;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.cocktails)
  public data!: Ingredient;

  constructor(props?: Measure) {
    Object.assign(this, props);
  }
}
