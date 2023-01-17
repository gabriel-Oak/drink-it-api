import { Request, Response } from 'express';
import controller from '../../../utils/controller/decorators/controller';
import get from '../../../utils/controller/decorators/get';

@controller('/cocktail')
export default class CocktailController {
  @get('/')
  async getCocktails(req: Request, res: Response) {
    return res.status(500).json('not implemented');
  }
}
