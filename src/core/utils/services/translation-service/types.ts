import BaseError from '../../errors/base-error';
import { Either } from '../../types';

export interface TranslationResponse {
  data: {
    translations: Array<{
      translatedText: string
    }>
  }
}

export class TranslationServiceError extends BaseError {
  public readonly type = 'translation-service';
}

export interface TranslationQuery {
  data: string;
  target: string;
  source: string;
}

export interface ITranslationService {
  translate: (query: TranslationQuery) => Promise<Either<TranslationServiceError, string>>;
}
