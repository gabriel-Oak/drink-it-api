import axios from 'axios';
import HttpService from './http-service';
import { IHttpService } from './types';

let instance: IHttpService;

const createHttpService = (): IHttpService => {
  const client = axios.create();
  if (!instance) instance = new HttpService(client);
  return instance;
};

export default createHttpService;
