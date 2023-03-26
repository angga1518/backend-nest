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
  CAPTURE = 'capture',
  SETTLEMENT = 'settlement',
  PENDING = 'pending',
}

export class ItemDto {
  name: string;
  quantity: number;
  price: number;
}

class TransactionDto {
  order_id: string;
  gross_amount: string;
}

class CustomerDto {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

class CreditCardDto {
  secure: boolean;
}

class ExpiryDto {
  unit: string;
  duration: number;
}

export class PaymentRqDto {
  transaction_details: TransactionDto;
  item_details: ItemDto[];
  customer_details: CustomerDto;
  enabled_payments: string[];
  credit_card: CreditCardDto;
  expiry: ExpiryDto;
}

export class CallbackPaymentDto {
  transaction_time: string;
  transaction_status: PaymentStatus;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  gross_amount: string;
}
