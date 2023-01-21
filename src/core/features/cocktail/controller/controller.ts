import { FastifyReply, FastifyRequest } from 'fastify';
import controller from '../../../utils/controller/decorators/controller';
import get from '../../../utils/controller/decorators/get';
import HttpError from '../../../utils/errors/http-error';
import { getCocktailsQuery } from '../models/get-cocktails';
import { IGetCocktailsUsecase } from '../usecases/get-cocktails/types';
import { IGetDetailsUsecase } from '../usecases/get-details/type';

@controller('/cocktail')
export default class CocktailController {
  constructor(
    private readonly getCocktailsUsecase: IGetCocktailsUsecase,
    private readonly getDetailsUsecase: IGetDetailsUsecase
  ) { }

  @get('/')
  async getCocktails(req: FastifyRequest, reply: FastifyReply) {
    const { query } = req;
    if (!query || !Object.values(query as object).some(Boolean)) {
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

  @get('/:cocktailId')
  async getDetails(req: FastifyRequest, reply: FastifyReply) {
    const { cocktailId } = req.params as { cocktailId: string };
    const result = await this.getDetailsUsecase.execute(cocktailId);

    if (!result.isError) return await reply.send(result.success);

    const error = new HttpError({
      ...result.error,
      statusCode: result.error.type === 'get-detail-validation' ? 400 : 500
    });
    return await reply.code(error.statusCode).send(error);
  }
}
