import { TRANSLATE_API, TRANSLATE_API_KEY } from '../../constants';
import { Left, Right } from '../../types';
import { IHttpService } from '../http-service/types';
import { ILoggerService } from '../logger/types';
import { ITranslationService, TranslationQuery, TranslationResponse, TranslationServiceError } from './types';

export default class TranslationService implements ITranslationService {
  constructor(
    private readonly httpService: IHttpService,
    private readonly logger: ILoggerService
  ) { }

  async translate(query: TranslationQuery) {
    const encodedParams = new URLSearchParams();
    encodedParams.append('q', query.data);
    encodedParams.append('target', query.target);
    encodedParams.append('source', query.source);

    try {
      const result = await this.httpService.post<TranslationResponse>(TRANSLATE_API, encodedParams, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'application/gzip',
          'X-RapidAPI-Key': TRANSLATE_API_KEY,
          'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        }
      });

      return new Right(result.data.translations.join(' \r\n'));
    } catch (e) {
      const error = new TranslationServiceError((e as any)?.message ?? 'Something went wrong searching translation', e);
      this.logger.warn(error.message, error);

      return new Left(error);
    }
  }
}
