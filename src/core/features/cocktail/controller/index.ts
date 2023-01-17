import createGetCocktailsUsecase from '../usecases/get-cocktails';
import CocktailController from './controller';

const createCocktailController = () => new CocktailController(
  createGetCocktailsUsecase()
);

export default createCocktailController;
