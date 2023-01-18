import createGetCocktailsUsecase from '../usecases/get-cocktails';
import CocktailControllerEPRECATED from './controller-DEPRECATED';
import CocktailController from './controller';

export const createCocktailControllerDEPRECATED = () => new CocktailControllerEPRECATED(
  createGetCocktailsUsecase()
);

const createCocktailController = () => new CocktailController(
  createGetCocktailsUsecase()
);

export default createCocktailController;
