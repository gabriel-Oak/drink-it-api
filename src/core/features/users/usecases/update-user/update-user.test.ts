import { mock, mockReset } from 'jest-mock-extended';
import { Left, Right } from '../../../../utils/types';
import { IInternalUserDatasource, InternalUserDatasourceError } from '../../datasources/internal-datasource/types';
import User from '../../models/user';
import { IUpdateUserUsecase, UpdateUserInvalidPassError } from './types';
import UpdateUserUsecase from './update-user';

describe('UpdateUserUsecase Tests', () => {
  const userMock = mock<User>();
  const payloadMock = {
    id: 'string',
    name: 'string',
    email: 'string',
    username: 'string',
    password: 'string'
  }
  const datasourceMock = mock<IInternalUserDatasource>();
  const usecase: IUpdateUserUsecase = new UpdateUserUsecase(datasourceMock);

  beforeEach(() => {
    mockReset(datasourceMock);
    mockReset(userMock);
  });

  it('Should validate invalid password', async () => {
    userMock.comparePasswords.mockImplementation(async () => false);
    const result = await usecase.execute(userMock, payloadMock);

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(UpdateUserInvalidPassError);
  });

  it('Should deal with datasource error', async () => {
    userMock.comparePasswords.mockImplementation(async () => true);
    datasourceMock.update.mockImplementation(async () => new Left(new InternalUserDatasourceError('')));
    const result = await usecase.execute(userMock, payloadMock);

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(InternalUserDatasourceError);
  });

  it('Should update user', async () => {
    userMock.comparePasswords.mockImplementation(async () => true);
    datasourceMock.update
      .mockImplementation(async () => new Right(null));
    const result = await usecase.execute(userMock, payloadMock);

    expect(result).toBeInstanceOf(Right);
  });
});
