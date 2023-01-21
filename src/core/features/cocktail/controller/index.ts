import createGetCocktailsUsecase from '../usecases/get-cocktails';
import createGetDetailUsecase from '../usecases/get-details';
import CocktailController from './controller';

const createCocktailController = () => new CocktailController(
  createGetCocktailsUsecase(),
  createGetDetailUsecase()
);

export default createCocktailController;
