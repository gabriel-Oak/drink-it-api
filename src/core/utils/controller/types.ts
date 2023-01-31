import { FastifyReply } from 'fastify';
import { FastifyRequestType } from 'fastify/types/type-provider';
import User from '../../features/users/models/user';

export type controllerAction = (req: FastifyRequestType, resp: FastifyReply, user?: User) => (
  unknown | Promise<unknown>
);

export interface IControllerActionMeta {
  path: string,
  action: string
}

export type ICreateController<T> = () => T;
