/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import Ingredient from './ingredient';

export interface CocktailFromSourceProps {
  idDrink: string;
  strDrink: string;
  strDrinkAlternate?: string;
  strTags?: string;
  strVideo?: string;
  strCategory?: string;
  strIBA?: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions?: string;
  strInstructionsES?: string;
  strInstructionsDE?: string;
  strInstructionsFR?: string;
  strInstructionsIT?: string;
  'strInstructionsZH-HANS'?: string;
  'strInstructionsZH-HANT'?: string;
  strDrinkThumb: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strImageSource?: string;
  strImageAttribution?: string;
  strCreativeCommonsConfirmed?: string;
  dateModified?: string;
}

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

  static fromSource(props: CocktailFromSourceProps) {
    const ingredients: Ingredient[] = [];
    (Object.keys(props) as Array<keyof CocktailFromSourceProps>).forEach((key) => {
      if (key.includes('Ingredient') && !!props[key]) {
        ingredients.push(new Ingredient({
          name: props[key]!,
          measure: props[`strMeasure${key.split('Ingredient')[1]}` as keyof CocktailFromSourceProps]
        }));
      }
    });

    return new Cocktail({
      id: props.idDrink,
      name: props.strDrink,
      thumb: props.strDrinkThumb,
      tags: props.strTags,
      category: props.strCategory,
      alcoholic: props.strAlcoholic,
      glass: props.strGlass,
      video: props.strVideo,
      instructions: props.strInstructions,
      instructionsES: props.strInstructionsES,
      instructionsDE: props.strInstructionsDE,
      instructionsFR: props.strInstructionsFR,
      instructionsIT: props.strInstructionsIT,
      dateModified: props.dateModified,
      iba: props.strIBA,
      ingredients
    });
  }
}
