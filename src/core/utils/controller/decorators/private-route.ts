import { SYMBOL_PRIVATE } from './symbols';

const privateRoute = () => {
  return (
    target: any,
    propertyKey: string
  ) => {
    if (!Reflect.hasMetadata(SYMBOL_PRIVATE, target.constructor)) {
      Reflect.defineMetadata(SYMBOL_PRIVATE, [], target.constructor);
    }

    const privateRoutes = Reflect.getMetadata(SYMBOL_PRIVATE, target.constructor) as string[];
    privateRoutes.push(propertyKey);
    Reflect.defineMetadata(SYMBOL_PRIVATE, privateRoutes, target.constructor);
  };
}

export default privateRoute;
