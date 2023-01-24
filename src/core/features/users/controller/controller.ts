import { FastifyReply, FastifyRequest } from 'fastify';
import controller from '../../../utils/controller/decorators/controller';
import post from '../../../utils/controller/decorators/post';
import HttpError from '../../../utils/errors/http-error';
import { UserProps } from '../models/user';
import { IAuthenticateUserUsecase, LoginPayload } from '../usecases/authenticate-user/types';
import { IInsertUserUsecase } from '../usecases/insert-user/types';
import { ISignUserTokenUsecase } from '../usecases/sign-user-token/types';
import { IValidateUserUsecase } from '../usecases/validate-user/types';

@controller('/user')
export default class UserController {
  constructor(
    private readonly validateUser: IValidateUserUsecase,
    private readonly insertUser: IInsertUserUsecase,
    private readonly signUserToken: ISignUserTokenUsecase,
    private readonly authenticateUser: IAuthenticateUserUsecase
  ) { }

  @post('/new')
  async new(req: FastifyRequest, reply: FastifyReply) {
    const payload = req.body as UserProps;
    const validate = this.validateUser.execute(payload);
    if (validate.isError) {
      const error = new HttpError({
        ...validate.error,
        statusCode: 400
      });
      return await reply.code(error.statusCode).send(error);
    }

    const insertResult = await this.insertUser.execute(payload);
    if (insertResult.isError) {
      const error = new HttpError(insertResult.error);
      if (insertResult.error.type === 'insert-user-already-exist') error.statusCode = 409;
      return await reply.code(error.statusCode).send(error);
    }

    const { success: user } = insertResult;
    const token = this.signUserToken.execute(user);
    return await reply.send({ token, user });
  }

  @post('/authenticate')
  async authenticate(req: FastifyRequest, reply: FastifyReply) {
    const payload = req.body as LoginPayload;
    const authResult = await this.authenticateUser.execute(payload);
    if (authResult.isError) {
      const error = new HttpError({
        ...authResult.error,
        statusCode: {
          'authenticate-user-not-found': 404,
          'authenticate-user-wrong-password': 403,
          'authenticate-invalid': 400
        }[String(authResult.error.type)] ?? 500
      });
      return await reply.code(error.statusCode).send(error);
    }

    const { success: user } = authResult;
    const token = this.signUserToken.execute(user);
    return await reply.send({ user, token });
  }
}
