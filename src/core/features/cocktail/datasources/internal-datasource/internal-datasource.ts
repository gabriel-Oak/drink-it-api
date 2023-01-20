import { In, Repository } from 'typeorm';
import { ILoggerService } from '../../../../utils/services/logger/types';
import { Left, Right } from '../../../../utils/types';
import Cocktail from '../../models/cocktail';
import Measure from '../../models/measure';
import Ingredient from '../../models/ingredient';
import { IInternalCocktailDatasource, InternalCocktailDatasourceError } from './types';

export default class InternalCocktailDatasource implements IInternalCocktailDatasource {
  constructor(
    private readonly cocktailRepository: Repository<Cocktail>,
    private readonly measureRepository: Repository<Measure>,
    private readonly ingredientRepository: Repository<Ingredient>,
    private readonly logger: ILoggerService
  ) { }

  async saveOne(cocktail: Cocktail) {
    try {
      const cocktailExists = await this.cocktailRepository.findOne({ where: { id: cocktail.id } });

      if (!cocktailExists) await this.cocktailRepository.save(cocktail);

      for (const measure of cocktail.measures) {
        const ingredientExists = await this.ingredientRepository.findOne({ where: { name: measure.ingredient.name } });

        const newMeasure = new Measure({
          ...measure,
          ingredient: ingredientExists ?? await this.ingredientRepository.save(measure.ingredient),
          cocktail
        });

        const measureExists = await this.measureRepository.findOne({
          where: { cocktail, ingredient: newMeasure.ingredient }
        });

        if (!measureExists) await this.measureRepository.save(newMeasure);
      }

      return new Right(null);
    } catch (e) {
      const error = new InternalCocktailDatasourceError((e as any).message ?? 'Someting went wrong saving cocktail', {
        error: e,
        cocktailId: cocktail.id
      });
      this.logger.error(error.message, error);
      return new Left(error);
    }
  }

  async findOne(cocktailId: string) {
    try {
      const cocktail = await this.cocktailRepository.findOne({
        where: { id: cocktailId },
        relations: ['measures', 'measures.ingredient']
      });
      return new Right(cocktail);
    } catch (e) {
      const error = new InternalCocktailDatasourceError((e as any).message ?? 'Someting went search cocktail', {
        error: e,
        cocktailId
      });
      this.logger.error(error.message, error);
      return new Left(error);
    }
  }

  async findMany(cocktailsIds: string[]) {
    try {
      const cocktails = await this.cocktailRepository.find({
        where: {
          id: In(cocktailsIds)
        },
        relations: ['measures', 'measures.ingredient']
      });
      return new Right(cocktails);
    } catch (e) {
      const error = new InternalCocktailDatasourceError((e as any).message ?? 'Someting went search cocktail', {
        error: e,
        cocktailsIds
      });
      this.logger.error(error.message, error);
      return new Left(error);
    }
  };
}
