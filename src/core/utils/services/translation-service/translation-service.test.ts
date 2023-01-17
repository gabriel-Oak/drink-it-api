import { mock, mockReset } from 'jest-mock-extended';
import { Left, Right } from '../../types';
import { IHttpService } from '../http-service/types';
import { ILoggerService } from '../logger/types';
import TranslationService from './translation-service';
import { ITranslationService, TranslationServiceError } from './types';

describe('TranslationService Tests', () => {
  const httpServiceMock = mock<IHttpService>();
  const loggerMock = mock<ILoggerService>();
  const service: ITranslationService = new TranslationService(httpServiceMock, loggerMock);

  beforeEach(() => {
    mockReset(httpServiceMock);
    mockReset(loggerMock);
  });

  it('Should get translations', async () => {
    httpServiceMock.post.mockImplementation(async() => ({
      data: {
        translations: [{
          translatedText: 'Olá meu amiguinho, pls me contrata'
        }]
      }
    }));
    const result = await service.translate({
      data: 'Hello my little friend, pls hire me',
      target: 'en',
      source: 'pt'
    });

    expect(result).toBeInstanceOf(Right);
  });

  it('Should deal with errors', async () => {
    httpServiceMock.post.mockRejectedValue(Error('OH NOOOOOO'));
    const result = await service.translate({
      data: 'Hello my little friend, pls hire me',
      target: 'en',
      source: 'pt'
    });

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(TranslationServiceError);
  });
});
