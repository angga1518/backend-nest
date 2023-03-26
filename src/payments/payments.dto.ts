import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export enum PaymentStatus {
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
}

export class ItemDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  category: string;
}

class CustomerDto {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  mobile_number: string;
}

class CustomerNotificationPreferenceDto {
  @IsString()
  invoice_created: string[] | null;
  @IsString()
  invoice_reminder: string[] | null;
  @IsString()
  invoice_paid: string[] | null;
  @IsString()
  invoice_expired: string[] | null;
}

export class PaymentRqDto {
  @IsString()
  external_id: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  // in seconds
  @IsNumber()
  invoice_duration: number;

  @IsObject()
  @ValidateNested()
  customer: CustomerDto;

  @ValidateNested()
  customer_notification_preference: CustomerNotificationPreferenceDto;

  @IsUrl()
  success_redirect_url: string;

  @IsUrl()
  failure_redirect_url: string;

  @IsString()
  currency: string;

  payment_methods: string[] | null;

  @IsArray()
  @ValidateNested({ each: true })
  items: ItemDto[];
}

export class callbackPaymentDto {
  @IsNotEmpty()
  @IsString()
  external_id: string;

  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsString()
  payment_channel: string;
}
