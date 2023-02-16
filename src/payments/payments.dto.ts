import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class AddressDto {
  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  postal_code: string;

  @IsString()
  state: string;

  @IsString()
  street_line1: string;

  @IsString()
  street_line2: string;
}

class CustomerDto {
  @IsString()
  given_names: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  mobile_number: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  addresses: AddressDto[];
}

export class CreatePaymentRqDto {
  @IsNotEmpty()
  @IsString()
  external_id: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  failure_redirect_url: string;

  @IsNotEmpty()
  @IsString()
  success_redirect_url: string;

  @IsNotEmpty()
  @IsString()
  customer: CustomerDto;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  payment_methods: string[];

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  customer_notification_preference: CustomerNotificationPreferencesDto;
}

class CustomerNotificationPreferencesDto {
  @IsArray()
  invoice_created: string[];

  @IsArray()
  invoice_reminder: string[];

  @IsArray()
  invoice_paid: string[];

  @IsArray()
  invoice_expired: string[];
}

export class CreatePaymentRsDto {
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
