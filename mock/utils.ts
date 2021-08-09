export function resultSuccess<T = unknown>(data: T, { msg = 'success' } = {}) {
  return {
    code: 0,
    data,
    msg,
  };
}
