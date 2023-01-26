import { ISignUserTokenUsecase } from './types';
import SignUserTokenUsecase from './sign-user-token';
import User from '../../models/user';
import { mock, mockReset } from 'jest-mock-extended';
import { ICacheService } from '../../../../utils/services/cache-service/types';

describe('SignUserUsecase Tests', () => {
  const cacheMock = mock<ICacheService>();
  const usecase: ISignUserTokenUsecase = new SignUserTokenUsecase(cacheMock);

  beforeEach(() => {
    mockReset(cacheMock);
  });

  it('Should sign token', () => {
    const token = usecase.execute(new User({
      email: 'olha@gmail.com',
      name: 'Hello World',
      password: 'oyuweyfyewf7yisdfiuhsdf',
      username: 'hellow',
      id: '8sd98fysd89f'
    }));

    expect(typeof token).toBe('string');
    const segments = token.split('.');
    expect(segments.length).toBe(3);
  });
});
