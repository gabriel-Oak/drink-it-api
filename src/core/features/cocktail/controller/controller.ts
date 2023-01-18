import { FastifyReply, FastifyRequest } from 'fastify';
import controller from '../../../utils/controller/decorators/controller';
import get from '../../../utils/controller/decorators/get';
import HttpError from '../../../utils/errors/http-error';
import { getCocktailsQuery } from '../models/get-cocktails';
import { IGetCocktailsUsecase } from '../usecases/get-cocktails/types';

@controller('/cocktail')
export default class CocktailController {
  constructor(private readonly getCocktailsUsecase: IGetCocktailsUsecase) { }

  @get('/')
  async getCocktails(req: FastifyRequest, reply: FastifyReply) {
    const { query } = req;
    if (!query || !Object.values(query).some(Boolean)) {
      const error = new HttpError({
        message: 'Sorry, you need to specify a searching parameter',
        statusCode: 400
      });
      return await reply.code(error.statusCode).send(error);
    }

    const result = await this.getCocktailsUsecase.execute(query as getCocktailsQuery);
    if (!result.isError) return await reply.send(result.success);

    const error = new HttpError(result.error);
    return await reply.code(error.statusCode).send(error);
  }
}
