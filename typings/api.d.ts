declare namespace API {
  export interface ResponseBody<T> {
    code: number;
    data: T;
    msg: string;
  }
}
