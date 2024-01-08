import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterRqDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsPhoneNumber()
  public phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class RegisterRsDTO {
  public email: string;
  public name: string;
  public phoneNumber: string;
}

export class LoginRqDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class LoginRsDTO {
  public token: string;
}

export class RefreshAccessTokenRqDto {
  @IsString()
  public refreshToken: string;
}

export class RefreshAccessTokenRsDto {
  public token: string;
}

export class ResetPasswordRqDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public confirmationPassword: string;

  @IsString()
  public otp: string;
}

export class RequestOtpRqDto {
  @IsEmail()
  public email: string;
}

export class Token {
  public token: string;
  public refreshToken: string | null;
}

export class UserDto {
  email: string;
  name: string;
}
