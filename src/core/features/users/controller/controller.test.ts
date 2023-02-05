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
import { DecodeUserInvalidTokenError, DecodeUserNotFoundError, IDecodeUserTokenUsecase } from '../usecases/decode-user-token/types';
import { InternalUserDatasourceError } from '../datasources/internal-datasource/types';
import { ChangePasswordInvalidOldPassError, ChangePasswordInvalidPassError, IChangePasswordUsecase } from '../usecases/change-password/types';
import { IUpdateUserUsecase, UpdateUserInvalidPassError } from '../usecases/update-user/types';

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
  const changePasswordMock = mock<IChangePasswordUsecase>();
  const updateUserMock = mock<IUpdateUserUsecase>();

  const userMock = new User({ ...body, password: undefined });
  const auth = 'iaehdiosahd8aksjhdjahsd8hjsakh.ajsihdkasdkashdkhaskdjhaksd.jkasdjkhaskdhaksdhkasjdha';

  const controller = new UserController(
    validateUserMock,
    insertUserMock,
    signUserTokenMock,
    authenticateUserMock,
    decodeUserTokenMock,
    changePasswordMock,
    updateUserMock
  );

  beforeEach(() => {
    mockReset(requestMock);
    mockReset(replyMock);
    mockReset(validateUserMock);
    mockReset(insertUserMock);
    mockReset(signUserTokenMock);
    mockReset(authenticateUserMock);
    mockReset(decodeUserTokenMock);
    mockReset(changePasswordMock);
    mockReset(updateUserMock);
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
      message: 'User already exist, try a different email or usernal',
      statusCode: 409
    }));
  });

  it('Should return user and auth', async () => {
    validateUserMock.execute
      .mockImplementation(() => new Right(null));
    insertUserMock.execute
      .mockImplementation(async () => new Right(new User({ ...body, password: undefined })));
    signUserTokenMock.execute
      .mockImplementation(() => auth);
    await controller.new(requestMock, replyMock);

    expect(replyMock.send).toHaveBeenCalledWith({
      user: new User({ ...body, password: undefined }),
      auth
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
      .mockImplementation(() => auth);
    await controller.authenticate(requestMock, replyMock);

    expect(replyMock.send).toHaveBeenCalledWith({
      user: userMock,
      auth
    });
  });

  it('Should decode user', async () => {
    decodeUserTokenMock.execute.mockImplementation(async () => new Right(userMock));
    await controller.decode({ ...requestMock, headers: { auth } }, replyMock);
    expect(replyMock.send).toHaveBeenCalledWith(userMock.getProps());
  });

  it('Should return invalid auth', async () => {
    const error = new DecodeUserInvalidTokenError();
    decodeUserTokenMock.execute
      .mockImplementation(async () => new Left(error));
    await controller.decode({ ...requestMock, headers: { auth } }, replyMock);
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({ ...error, statusCode: 400 }));
    expect(replyMock.code).toHaveBeenCalledWith(400);
  });

  it('Should return decode user not found', async () => {
    const error = new DecodeUserNotFoundError();
    decodeUserTokenMock.execute
      .mockImplementation(async () => new Left(error));
    await controller.decode({ ...requestMock, headers: { auth } }, replyMock);
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({ ...error, statusCode: 404 }));
    expect(replyMock.code).toHaveBeenCalledWith(404);
  });

  it('Should handle datasource error', async () => {
    const error = new InternalUserDatasourceError('');
    decodeUserTokenMock.execute
      .mockImplementation(async () => new Left(error));
    await controller.decode({ ...requestMock, headers: { auth } }, replyMock);
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError(error));
    expect(replyMock.code).toHaveBeenCalledWith(500);
  });

  it('Should change user password', async () => {
    changePasswordMock.execute
      .mockImplementation(async () => new Right('Success my boy'));
    await controller.changeUserPassword(
      { ...requestMock, headers: { auth } },
      replyMock,
      userMock
    );

    expect(replyMock.send).toHaveBeenCalledWith({ message: 'Success my boy' });
  });

  it('Should handle ChangePasswordInvalidPassError', async () => {
    changePasswordMock.execute
      .mockImplementation(async () => new Left(new ChangePasswordInvalidPassError()));
    await controller.changeUserPassword(
      { ...requestMock, headers: { auth } },
      replyMock,
      userMock
    );

    expect(replyMock.code).toHaveBeenCalledWith(400);
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({
      statusCode: 400,
      message: 'Invalid passwords informed, check if its spelled right and try again'
    }));
  });

  it('Should handle ChangePasswordInvalidOldPassError', async () => {
    changePasswordMock.execute
      .mockImplementation(async () => new Left(new ChangePasswordInvalidOldPassError()));
    await controller.changeUserPassword(
      { ...requestMock, headers: { auth } },
      replyMock,
      userMock
    );

    expect(replyMock.code).toHaveBeenCalledWith(400);
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({
      statusCode: 400,
      message: 'Invalid old password, check if its spelled right and try again'
    }));
  });

  it('Should update user', async () => {
    updateUserMock.execute
      .mockImplementation(async () => new Right(null));
    await controller.update(
      { ...requestMock, headers: { auth } },
      replyMock,
      userMock
    );

    expect(replyMock.send).toHaveBeenCalled();
  });

  it('Should return pass error updatig user', async () => {
    updateUserMock.execute
      .mockImplementation(async () => new Left(new UpdateUserInvalidPassError()));
    await controller.update(
      { ...requestMock, headers: { auth } },
      replyMock,
      userMock
    );

    expect(replyMock.code).toHaveBeenCalledWith(403);
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({
      message: 'Password didn\'t match, please check its spelling',
      statusCode: 403
    }));
  });

  it('Should return internal error updatig user', async () => {
    updateUserMock.execute
      .mockImplementation(async () => new Left(new InternalUserDatasourceError('Oops')));
    await controller.update(
      { ...requestMock, headers: { auth } },
      replyMock,
      userMock
    );

    expect(replyMock.code).toHaveBeenCalledWith(500);
    expect(replyMock.send).toHaveBeenCalledWith(new HttpError({
      message: 'Oops'
    }));
  });
});
