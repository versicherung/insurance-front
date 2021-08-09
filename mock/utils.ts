export function resultSuccess<T = unknown>(data: T, { msg = 'success' } = {}) {
  console.log(data);
  return {
    code: 0,
    data,
    msg,
  };
}
