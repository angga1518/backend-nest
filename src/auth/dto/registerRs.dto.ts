export class RegisterRsDTO {
  email: string;
  name: string;
}

// TODO move to utils
class Response<T> {
  status: number;
  error: string[];
  data: T;
}
