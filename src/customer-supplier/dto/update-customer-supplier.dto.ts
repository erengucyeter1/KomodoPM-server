import { PartialType } from '@nestjs/swagger';
import { CreateCustomerSupplierDto } from './create-customer-supplier.dto';

export class UpdateCustomerSupplierDto extends PartialType(CreateCustomerSupplierDto) {}