import { Request, Response } from 'express';
import { FastifyReply } from 'fastify';
import { FastifyRequestType } from 'fastify/types/type-provider';

export type controllerAction = (req: Request, resp: Response) => (
  void | Promise<void>
);

export type controllerActionFastify = (req: FastifyRequestType, resp: FastifyReply) => (
  unknown | Promise<unknown>
);

export interface IControllerActionMeta {
  path: string,
  action: string
}

export type ICreateController<T> = () => T;
