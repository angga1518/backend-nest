export class BaseResponse<T> {
  status: number;
  error: string[] | null;
  data: T;
}
