import { FastifyReply, FastifyRequest } from 'fastify';
import { mock, mockDeep, mockReset } from 'jest-mock-extended';
import { IInsertUserUsecase, InsertUserAlreadyExist } from '../usecases/insert-user/types';
import { IValidateUserUsecase, ValidateUserError } from '../usecases/validate-user/types';
import { ISignUserTokenUsecase } from '../usecases/sign-user-token/types';
import { UserProps } from '../models/user';
import UserController from './controller';
import { Left, Right } from '../../../utils/types';
import HttpError from '../../../utils/errors/http-error';

describe('UserController Tests', () => {
  const body: UserProps = {
    email: 'hellomyboy@gmail.com',
    name: 'Jhon Doe',
    password: '123ohmygod',
    username: 'jhon123'
  };

  const requestMock = mock<FastifyRequest>({ query: { i: 'vodka' }, body } as any);
  const replyMock = mockDeep<FastifyReply>({ funcPropSupport: true });
  const validateUserMock = mock<IValidateUserUsecase>();
  const insertUserMock = mock<IInsertUserUsecase>();
  const signUserTokenMock = mock<ISignUserTokenUsecase>();
  const controller = new UserController(validateUserMock, insertUserMock, signUserTokenMock);

  beforeEach(() => {
    mockReset(requestMock);
    mockReset(replyMock);
    mockReset(validateUserMock);
    mockReset(insertUserMock);
    mockReset(signUserTokenMock);
    replyMock.code.mockImplementation(() => replyMock);
  });

  it('Should return paylod invalid creating user', async () => {
    validateUserMock.execute
      .mockImplementation(() => new Left(new ValidateUserError('Too dam hot')));
    await controller.createUser(requestMock, replyMock);

    expect(replyMock.code).toHaveBeenCalledWith(400);
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({
      message: 'Too dam hot',
      statusCode: 400
    }));
  });

  it('Should return user already exists', async () => {
    validateUserMock.execute
      .mockImplementation(() => new Right(null));
    insertUserMock.execute
      .mockImplementation(async () => new Left(new InsertUserAlreadyExist()));
    await controller.createUser(requestMock, replyMock);

    expect(replyMock.code).toHaveBeenCalledWith(409);
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({
      message: 'User already exist, try a different email',
      statusCode: 409
    }));
  });
});
