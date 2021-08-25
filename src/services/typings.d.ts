// @ts-ignore
/* eslint-disable */

declare namespace API {
  interface Result<T> {
    code?: number;
    data?: T;
    msg?: string;
  }

  type LoginParams = {
    username?: string;
    password?: string;
  };

  type LoginResultData = {
    id: number;
    role: number;
    token: string;
    username: string;
  };

  type LoginResult = Result<LoginResultData>;

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type OrderListItem = {
    carType: string;
    id: number;
    licensePlate: string;
    owner: string;
    payType: string;
    policy?: string;
    startTime: string;
  };

  type OrderList = Result<{ total: number; items: OrderListItem[] }>;

  type AliyunSTSResult = Result<{
    accessKey: string;
    accessKeySecret: string;
    securityToken: string;
  }>;

  type IdCardOcrResult = Result<{
    id: number;
    name: string;
    number: string;
    address: string;
  }>;

  type BusinessOcrResult = Result<{
    id: number;
    name: string;
    number: string;
    address: string;
  }>;

  type DrivingOcrResult = Result<{
    id: number;
    plate: string;
    engine: string;
    frame: string;
    type: string;
  }>;

  type CertificateOcrResult = Result<{
    id: number;
    engine: string;
    frame: string;
  }>;

  type CreateOrderParams = {
    startTime: string;
    paymentId: number;
    carTypeId: number;
    idCard?: {
      id: number;
      name: string;
      number: string;
      address: string;
    };
    businessLicense?: {
      id: number;
      name: string;
      number: string;
      address: string;
    };
    drivingLicense?: {
      id: number;
      plate: number;
      engine: string;
      frame: string;
      type: string;
    };
    certificate?: {
      id: number;
      engine: string;
      frame: string;
    };
  };

  type UserListParams = {
    current?: number;
    pageSize?: number;
    username?: string;
  };

  type UserListItem = {
    id: number;
    username: string;
    role: number;
  };

  type UserListResult = Result<{
    total: number;
    items: UserListItem[];
  }>;

  type AddUserParams = {
    username: string;
    password: string;
    roleId: number;
  };

  type DeleteUserParams = {
    id: number;
  };

  type UpdateUserParams = {
    id: number;
    password?: string;
    roleId: number;
  };
}
