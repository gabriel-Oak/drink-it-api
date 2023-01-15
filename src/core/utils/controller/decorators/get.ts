import { SYMBOL_GET } from './symbols';
import { IControllerActionMeta } from '../types';

export default function get(path: string) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
