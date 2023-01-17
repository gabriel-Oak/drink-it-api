import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import Ingredient from './ingredient';

@Entity()
export default class Cocktail {
  @PrimaryColumn()
  public id!: string;

  @Column()
  public name!: string;

  @Column()
  public thumb!: string;

  @Column()
  public alcoholic!: string;

  @Column()
  public glass!: string;

  @ManyToMany((_) => Ingredient)
  public ingredients!: Ingredient[];

  @Column()
  public category?: string;

  @Column()
  public video?: string;

  @Column()
  public tags?: string;

  @Column()
  public instructions?: string;

  @Column()
  public instructionsES?: string;

  @Column()
  public instructionsDE?: string;

  @Column()
  public instructionsFR?: string;

  @Column()
  public instructionsIT?: string;

  @Column()
  public instructionsPT?: string;

  @Column()
  public dateModified?: string;

  @Column()
  public iba?: string;

  constructor(props: Cocktail) {
    Object.assign(this, {
      ...props,
      ingredients: props.ingredients.map((i) => new Ingredient(i))
    });
  }
}
