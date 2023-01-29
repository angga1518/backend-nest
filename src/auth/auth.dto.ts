import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterRqDto {
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

export class RegisterRsDTO {
  email: string;
  name: string;
}

// TODO move to utils
export class BaseResponse<T> {
  status: number;
  error: string[];
  data: T;
}
