// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import umiRequest from 'umi-request';

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取订单列表 GET /api/insurance */
export async function order(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.OrderList>('/api/insurance', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出 Excel 表格 GET /api/insurance/export
export async function exportExcel(params: { startTime?: string; endTime?: string; id?: number[] }) {
  return umiRequest('/api/insurance/export', {
    responseType: 'blob',
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 导出 Excel 表格 GET /api/insurance/export
export async function createOrder(params: API.CreateOrderParams) {
  return request('/api/insurance', {
    method: 'POST',
    data: params,
  });
}
