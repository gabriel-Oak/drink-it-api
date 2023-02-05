import { z, ZodError, ZodIssue } from 'zod';
import { Left, Right } from '../../../../utils/types';
import { UserProps } from '../../models/user';
import { IValidateUserUsecase, ValidateUserError } from './types';

export default class ValidateUserUsecase implements IValidateUserUsecase {
  execute(user: UserProps) {
    try {
      const userSchema = z.object({
        name: z.string().min(3).max(250),
        username: z.string().min(3).max(250).regex(/([a-zA-Z\d])\w+/),
        email: z.string().email(),
        password: z.string().min(6).max(20)
      });
      userSchema.parse(user);
      return new Right(null);
    } catch (e) {
      const message = ((e as ZodError).errors).reduce(
        (prev: string, current: ZodIssue, index: any) => `${prev}${!index ? ' ' : ', '}${(current).path.join(', ')}`,
        'Sorry you need to specify a valid'
      );

      return new Left(new ValidateUserError(message + '.', e));
    }
  }
}
