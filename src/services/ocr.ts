import { request } from 'umi';

export function idCardOcr(url: string) {
  return request<API.IdCardOcrResult>('/api/ocr/idCard', {
    method: 'POST',
    data: {
      imgUrl: url,
    },
  });
}

export function businessOcr(url: string) {
  return request<API.BusinessOcrResult>('/api/ocr/business', {
    method: 'POST',
    data: {
      imgUrl: url,
    },
  });
}

export function drivingOcr(url: string) {
  return request<API.DrivingOcrResult>('/api/ocr/driving', {
    method: 'POST',
    data: {
      imgUrl: url,
    },
  });
}

export function certificateOcr(url: string) {
  return request<API.CertificateOcrResult>('/api/ocr/certificate', {
    method: 'POST',
    data: {
      imgUrl: url,
    },
  });
}

export function billOcr(url: string) {
  return request<API.BillOcrResult>('/api/ocr/bill', {
    method: 'POST',
    data: {
      imgUrl: url,
    },
  });
}

export function otherFile(url: string) {
  return request<API.OtherFileResult>('/api/ocr/otherFile', {
    method: 'POST',
    data: {
      imgUrl: url,
    },
  });
}
