import { mock, mockReset } from 'jest-mock-extended';
import { Left, Right } from '../../../../utils/types';
import { IInternalUserDatasource, InternalUserDatasourceError } from '../../datasources/internal-datasource/types';
import User, { UserProps } from '../../models/user';
import InsertUserUsecase from './insert-user';
import { IInsertUserUsecase, InsertUserAlreadyExist } from './types';

describe('InsertUserUsecase Tests', () => {
  const datasourceMock = mock<IInternalUserDatasource>();
  const usecase: IInsertUserUsecase = new InsertUserUsecase(datasourceMock);
  const payloadMock: UserProps = {
    email: 'hellomyboy@gmail.com',
    name: 'Jhon Doe',
    password: '123ohmygod',
    username: 'jhon123'
  };

  beforeEach(() => {
    mockReset(datasourceMock);
    datasourceMock.findByEmailOrUsername.mockImplementation(async () => new Right(null));
  });

  it('Should return InsertUserAlreadyExist', async () => {
    datasourceMock.findByEmailOrUsername.mockImplementation(async () => new Right(new User()));
    const result = await usecase.execute(payloadMock);

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(InsertUserAlreadyExist);
  });

  it('Should return InternalUserDatasourceError', async () => {
    datasourceMock.save.mockImplementation(async () => new Left(new InternalUserDatasourceError('Error')));
    const result = await usecase.execute(payloadMock);

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(InternalUserDatasourceError);
  });

  it('Should insert user', async () => {
    datasourceMock.save.mockImplementation(async () => new Right(new User(payloadMock)));
    const result = await usecase.execute(payloadMock);

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown>).success).toBeInstanceOf(User);
  });
});
