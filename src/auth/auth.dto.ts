import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterRqDto {
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsPhoneNumber()
  public readonly phone_number: string;

  @IsString()
  @IsNotEmpty()
  public readonly password: string;

  @IsString()
  public readonly image_url: string;
}

export class RegisterRsDTO {
  email: string;
  name: string;
  phoneNumber: string;
}

export class LoginRqDto {
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

export class LoginRsDTO {
  token: string;
}

export class RefreshAccessTokenRqDto {
  @IsNotEmpty()
  public readonly refresh_token: string;
}

export class RefreshAccessTokenRsDto {
  @IsNotEmpty()
  token: string;
}

export class GoogleAuthDto {
  @IsString()
  @IsNotEmpty()
  public readonly access_token: string;
}

export class GoogleAuthResponse {
  public email: string;
  public name: string;
  public picture: string;
  public verified_email: string;
  public error: any;
}

export class Token {
  token: string;
  refresh_token: string | null;
}
