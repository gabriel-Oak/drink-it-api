import { FastifyReply, FastifyRequest } from 'fastify';
import controller from '../../../utils/controller/decorators/controller';
import post from '../../../utils/controller/decorators/post';
import HttpError from '../../../utils/errors/http-error';
import { UserProps } from '../models/user';
import { IInsertUserUsecase } from '../usecases/insert-user/types';
import { ISignUserTokenUsecase } from '../usecases/sign-user-token/types';
import { IValidateUserUsecase } from '../usecases/validate-user/types';

@controller('/user')
export default class UserController {
  constructor(
    private readonly validateUser: IValidateUserUsecase,
    private readonly insertUser: IInsertUserUsecase,
    private readonly signUserToken: ISignUserTokenUsecase
  ) {}

  @post('/new')
  async createUser(req: FastifyRequest, reply: FastifyReply) {
    const payload = req.body as UserProps;
    const validate = this.validateUser.execute(payload);
    if (validate.isError) {
      return await reply.code(400).send(new HttpError({
        ...validate.error,
        statusCode: 400
      }));
    }
  }
}
