import { SYMBOL_DELETE } from './symbols';
import { IControllerActionMeta } from '../types';

const del = (path: string) => {
  return (
    target: any,
    propertyKey: string
  ) => {
    if (!Reflect.hasMetadata(SYMBOL_DELETE, target.constructor)) {
      Reflect.defineMetadata(SYMBOL_DELETE, [], target.constructor);
    }

    const gets = Reflect.getMetadata(SYMBOL_DELETE, target.constructor) as IControllerActionMeta[];
    gets.push({
      path,
      action: propertyKey
    });
    Reflect.defineMetadata(SYMBOL_DELETE, gets, target.constructor);
  };
}

export default del;
