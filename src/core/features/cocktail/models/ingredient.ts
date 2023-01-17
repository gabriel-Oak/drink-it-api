import { Column, Entity } from 'typeorm';

@Entity()
export default class Ingredient {
  @Column()
  public name!: string;

  @Column()
  public measure?: string;

  constructor(props: Ingredient) {
    Object.assign(this, props);
  }
}
