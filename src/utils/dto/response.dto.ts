export class BaseResponse<T> {
  statusCode: number;
  message: string[] | null;
  error: string | null;
  data: T;
}
