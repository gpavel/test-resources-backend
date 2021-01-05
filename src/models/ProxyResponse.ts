export interface ProxyResponse<T = unknown> {
  status: number;
  statusText: string;
  payload: T;
  headers: any;
}
