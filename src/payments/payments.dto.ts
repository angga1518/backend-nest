import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentRq {
  @IsString()
  @IsNotEmpty()
  external_id: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  payerEmail: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  failureRedirectUrl: string;

  @IsString()
  @IsNotEmpty()
  successRedirectUrl: string;
}

export class CreatePaymentRs {
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
