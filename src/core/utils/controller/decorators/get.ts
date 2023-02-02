import { SYMBOL_GET } from './symbols';
import { IControllerActionMeta } from '../types';

const get = (path: string) => {
  return (
    target: any,
    propertyKey: string
  ) => {
    if (!Reflect.hasMetadata(SYMBOL_GET, target.constructor)) {
      Reflect.defineMetadata(SYMBOL_GET, [], target.constructor);
    }

    const gets = Reflect.getMetadata(SYMBOL_GET, target.constructor) as IControllerActionMeta[];
    gets.push({
      path,
      action: propertyKey
    });
    Reflect.defineMetadata(SYMBOL_GET, gets, target.constructor);
  };
}

export default get;
