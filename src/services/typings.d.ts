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
    overPolicy?: string;
    policy?: string;
    startTime: string;
    username?: string;
    createAt: string;
  };

  type OrderList = Result<{ total: number; items: OrderListItem[] }>;

  type OrderDetailData = {
    id: number;
    owner: string;
    licensePlate: string;
    startTime: string;
    carType: string;
    payType: string;

    idCard?: {
      url: string;
      address: string;
      number: string;
    };

    business?: {
      url: string;
      address: string;
      number: string;
    };

    driving?: {
      url: string;
      frame: string;
      engine: string;
      type: string;
    };

    certificate?: {
      url: string;
      type: string;
      frame: string;
      engine: string;
    };

    policy?: {
      url: string;
      name: string;
      number: string;
    };
  };

  type OrderDetail = Result<OrderDetailData>;

  type CreateOrderParams = {
    startTime: string;
    paymentId: number;
    carTypeId: number;
    otherFileId: number[];
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
      type: string;
      engine: string;
      frame: string;
    };
    bill?: {
      type: number;
      url?: string;
      address?: string;
      phoneNumber: string;
      number?: string;
      bankName?: string;
      account?: string;
      name?: string;
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

  type UpdateOwnPasswordParams = {
    newPassword: string;
  };

  type PolicyListParams = {
    current?: number;
    pageSize?: number;
  };

  type PolicyListItem = {
    id: number;
    name: string;
    url: string;
    number: string;
    processType: number;
  };

  type PolicyListResult = Result<{
    total: number;
    items: PolicyListItem[];
  }>;

  type IdCardOcrResult = Result<{
    id: number;
    address: string;
    number: string;
    name: string;
  }>;

  type BusinessOcrResult = Result<{
    id: number;
    address: string;
    number: string;
    name: string;
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
    carType: string;
    engine: string;
    frame: string;
  }>;

  type BillOcrResult = Result<{
    name: string;
    number: string;
    address: string;
    phoneNumber: string;
    bankName: string;
    bankAccount: string;
  }>;

  type OtherFileResult = Result<{
    id: number;
  }>;
}
