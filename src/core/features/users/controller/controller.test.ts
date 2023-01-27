import { FastifyReply, FastifyRequest } from 'fastify';
import { mock, mockDeep, mockReset } from 'jest-mock-extended';
import { IInsertUserUsecase, InsertUserAlreadyExist } from '../usecases/insert-user/types';
import { IValidateUserUsecase, ValidateUserError } from '../usecases/validate-user/types';
import { ISignUserTokenUsecase } from '../usecases/sign-user-token/types';
import User, { UserProps } from '../models/user';
import UserController from './controller';
import { Left, Right } from '../../../utils/types';
import HttpError from '../../../utils/errors/http-error';
import {
  AuthenticateInvalidError, AuthenticateUserNotFoundError, AuthenticateUserWrongPasswordError, IAuthenticateUserUsecase
} from '../usecases/authenticate-user/types';
import { IDecodeUserTokenUsecase } from '../usecases/decode-user-token/types';

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
  const authenticateUserMock = mock<IAuthenticateUserUsecase>();
  const decodeUserTokenMock = mock<IDecodeUserTokenUsecase>();
  const userMock = new User({ ...body, password: undefined });

  const controller = new UserController(
    validateUserMock,
    insertUserMock,
    signUserTokenMock,
    authenticateUserMock,
    decodeUserTokenMock
  );

  beforeEach(() => {
    mockReset(requestMock);
    mockReset(replyMock);
    mockReset(validateUserMock);
    mockReset(insertUserMock);
    mockReset(signUserTokenMock);
    mockReset(authenticateUserMock);
    mockReset(decodeUserTokenMock);
    replyMock.code.mockImplementation(() => replyMock);
  });

  it('Should return paylod invalid creating user', async () => {
    validateUserMock.execute
      .mockImplementation(() => new Left(new ValidateUserError('Too dam hot')));
    await controller.new(requestMock, replyMock);

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
    await controller.new(requestMock, replyMock);

    expect(replyMock.code).toHaveBeenCalledWith(409);
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({
      message: 'User already exist, try a different email',
      statusCode: 409
    }));
  });

  it('Should return user and token', async () => {
    validateUserMock.execute
      .mockImplementation(() => new Right(null));
    insertUserMock.execute
      .mockImplementation(async () => new Right(new User({ ...body, password: undefined })));
    signUserTokenMock.execute
      .mockImplementation(() => 'iaehdiosahd8aksjhdjahsd8hjsakh.ajsihdkasdkashdkhaskdjhaksd.jkasdjkhaskdhaksdhkasjdha');
    await controller.new(requestMock, replyMock);

    expect(replyMock.send).toHaveBeenCalledWith({
      user: new User({ ...body, password: undefined }),
      token: 'iaehdiosahd8aksjhdjahsd8hjsakh.ajsihdkasdkashdkhaskdjhaksd.jkasdjkhaskdhaksdhkasjdha'
    });
  });

  it('Should return authenticate user not foud', async () => {
    authenticateUserMock.execute
      .mockImplementation(async () => new Left(new AuthenticateUserNotFoundError()));
    await controller.authenticate(requestMock, replyMock);

    expect(replyMock.code).toHaveBeenCalledWith(404)
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({
      statusCode: 404,
      message: 'Sorry couldn\'t find any user for this email =/'
    }));
  });

  it('Should return invalid payload error', async () => {
    authenticateUserMock.execute
      .mockImplementation(async () => new Left(new AuthenticateInvalidError()));
    await controller.authenticate(requestMock, replyMock);

    expect(replyMock.code).toHaveBeenCalledWith(400)
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({
      statusCode: 400,
      message: 'Oh looks like you didn\'t specify an email or a password'
    }));
  });

  it('Should return authenticate wrong password', async () => {
    authenticateUserMock.execute
      .mockImplementation(async () => new Left(new AuthenticateUserWrongPasswordError()));
    await controller.authenticate(requestMock, replyMock);

    expect(replyMock.code).toHaveBeenCalledWith(403)
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({
      statusCode: 403,
      message: 'Wrong password, please try again'
    }));
  });

  it('Should return authenticated user', async () => {
    authenticateUserMock.execute
      .mockImplementation(async () => new Right(userMock));
    signUserTokenMock.execute
      .mockImplementation(() => 'iaehdiosahd8aksjhdjahsd8hjsakh.ajsihdkasdkashdkhaskdjhaksd.jkasdjkhaskdhaksdhkasjdha');
    await controller.authenticate(requestMock, replyMock);

    expect(replyMock.send).toHaveBeenCalledWith({
      user: userMock,
      token: 'iaehdiosahd8aksjhdjahsd8hjsakh.ajsihdkasdkashdkhaskdjhaksd.jkasdjkhaskdhaksdhkasjdha'
    });
  });

  it('Should decode user', async () => {
    decodeUserTokenMock.execute.mockImplementation(async () => new Right(userMock));
  });
});
