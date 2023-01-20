import { FastifyReply } from 'fastify';
import { FastifyRequestType } from 'fastify/types/type-provider';

export type controllerAction = (req: FastifyRequestType, resp: FastifyReply) => (
  unknown | Promise<unknown>
);

export interface IControllerActionMeta {
  path: string,
  action: string
}

export type ICreateController<T> = () => T;
