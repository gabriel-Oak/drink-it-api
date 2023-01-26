import { mock, mockReset } from 'jest-mock-extended';
import { IInternalUserDatasource, InternalUserDatasourceError } from '../../datasources/internal-datasource/types';
import { DecodeUserInvalidTokenError, DecodeUserNotFoundError, IDecodeUserTokenUsecase } from './types';
import DecodeUserTokenDatasource from './decode-user-token';
import { Left, Right } from '../../../../utils/types';
import User from '../../models/user';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../utils/constants';

describe('DecodeUserTokenUsecase Test', () => {
  const userDatasourceMock = mock<IInternalUserDatasource>();
  const usecase: IDecodeUserTokenUsecase = new DecodeUserTokenDatasource(userDatasourceMock);
  const token = sign({ email: '', id: '', name: '', username: '' }, JWT_SECRET);

  beforeEach(() => {
    mockReset(userDatasourceMock);
  });

  it('Should invalid token error', async () => {
    const result = await usecase.execute('ihoujfessfdihuj.hisudfdfsu');

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(DecodeUserInvalidTokenError);
  });

  it('Should return user not found error', async () => {
    userDatasourceMock.findById.mockImplementation(async () => new Right(null));
    const result = await usecase.execute(token);

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(DecodeUserNotFoundError);
  });

  it('Should return datasource error', async () => {
    userDatasourceMock.findById.mockImplementation(async () => new Left(new InternalUserDatasourceError('')));
    const result = await usecase.execute(token);

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(InternalUserDatasourceError);
  });

  it('Should decode succefuly', async () => {
    userDatasourceMock.findById.mockImplementation(async () => new Right(new User()));
    const result = await usecase.execute(token);

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown>).success).toBeInstanceOf(User);
  });
});
