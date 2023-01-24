import { mock, mockReset } from 'jest-mock-extended';
import { IInternalUserDatasource, InternalUserDatasourceError } from '../../datasources/internal-datasource/types';
import { AuthenticateInvalidError, AuthenticateUserNotFoundError, AuthenticateUserWrongPasswordError, IAuthenticateUserUsecase, LoginPayload } from './types'
import AuthenticateUserUsecase from './authenticate-user'
import { Left, Right } from '../../../../utils/types';
import User from '../../models/user';

describe('AuthenticateUserUsecase Tests', () => {
  const userDatasourceMock = mock<IInternalUserDatasource>();
  const usecase: IAuthenticateUserUsecase = new AuthenticateUserUsecase(userDatasourceMock);
  const payloadMock: LoginPayload = {
    email: 'hellomyboy@gmail.com',
    password: '123ohmygod'
  };
  const userMock = new User({
    ...payloadMock,
    name: 'Jhon Doe',
    username: 'jhon123'
  });

  beforeAll(async () => {
    await userMock.hashPassword();
  });

  beforeEach(() => {
    mockReset(userDatasourceMock);
  });

  it('Should return when datasource fail', async () => {
    userDatasourceMock.findByEmail
      .mockImplementation(async () => new Left(new InternalUserDatasourceError('Oh no')));
    const result = await usecase.execute(payloadMock);

    expect(result).toBeInstanceOf(Left);
  });

  it('Should return no user found', async () => {
    userDatasourceMock.findByEmail
      .mockImplementation(async () => new Right(null));
    const result = await usecase.execute(payloadMock);

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(AuthenticateUserNotFoundError);
  });

  it('Should return wrong password', async () => {
    userDatasourceMock.findByEmail
      .mockImplementation(async () => new Right(userMock));
    const result = await usecase.execute({ ...payloadMock, password: '123hardpass' });

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(AuthenticateUserWrongPasswordError);
  });

  it('Should authenticate user', async () => {
    userDatasourceMock.findByEmail
      .mockImplementation(async () => new Right(userMock));
    const result = await usecase.execute(payloadMock);

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown>).success).toBeInstanceOf(User);
  });

  it('Should return invalid data error', async () => {
    const result = await usecase.execute({ email: 'joisjdof' } as any);

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(AuthenticateInvalidError);
  });
});
