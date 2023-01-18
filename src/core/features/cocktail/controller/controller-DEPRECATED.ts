import { Request, Response } from 'express';
import controller from '../../../utils/controller/decorators/controller';
import get from '../../../utils/controller/decorators/get';
import HttpError from '../../../utils/errors/http-error';
import { getCocktailsQuery } from '../models/get-cocktails';
import { IGetCocktailsUsecase } from '../usecases/get-cocktails/types';

@controller('/cocktail')
export default class CocktailControllerDEPRECATED {
  constructor(private readonly getCocktailsUsecase: IGetCocktailsUsecase) {}

  @get('/')
  async getCocktails(req: Request, res: Response) {
    const result = await this.getCocktailsUsecase.execute(req.query as getCocktailsQuery);
    if (!result.isError) return res.json(result.success);

    const error = new HttpError(result.error);
    return res.status(error.statusCode).json(error);
  }
}
