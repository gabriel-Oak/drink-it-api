import { SYMBOL_POST } from './symbols';
import { IControllerActionMeta } from '../types';

const post = (path: string) => {
  return (
    target: object,
    propertyKey: string
  ) => {
    if (!Reflect.hasMetadata(SYMBOL_POST, target.constructor)) {
      Reflect.defineMetadata(SYMBOL_POST, [], target.constructor);
    }

    const gets = Reflect.getMetadata(SYMBOL_POST, target.constructor) as IControllerActionMeta[];
    gets.push({
      path,
      action: propertyKey
    });
    Reflect.defineMetadata(SYMBOL_POST, gets, target.constructor);
  };
}

export default post;
