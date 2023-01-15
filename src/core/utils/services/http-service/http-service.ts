import { Axios, AxiosRequestConfig } from 'axios';
import { IHttpService } from './types';

export default class HttpService implements IHttpService {
  constructor(private readonly client: Axios) { }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const { data } = await this.client.get<T>(url, config);
    return data;
  }

  async post<T>(url: string, payload: unknown, config?: AxiosRequestConfig) {
    const { data } = await this.client.post<T>(url, payload, config);
    return data;
  }
}
