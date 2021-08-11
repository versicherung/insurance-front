declare namespace API {
  export interface ResponseBody<T = any> {
    code: number;
    data: T;
    msg: string;
  }
}
