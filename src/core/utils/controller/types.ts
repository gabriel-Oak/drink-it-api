import { Request, Response } from 'express';

export type controllerAction = (req: Request, resp: Response) => (
  void | Promise<void>
);

export interface IControllerActionMeta {
  path: string,
  action: string
}

export type ICreateController<T> = () => T;
