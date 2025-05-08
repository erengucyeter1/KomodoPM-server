import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerSupplierDto } from './dto/create-customer-supplier.dto';
import { UpdateCustomerSupplierDto } from './dto/update-customer-supplier.dto';

@Injectable()
export class CustomerSupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerSupplierDto: CreateCustomerSupplierDto) {
    return this.prisma.customerSupplier.create({
      data: {
        title: createCustomerSupplierDto.title,
        taxOffice: createCustomerSupplierDto.taxOffice,
        taxNumber: createCustomerSupplierDto.taxNumber,
        address: createCustomerSupplierDto.address,
        countryCode: createCustomerSupplierDto.countryCode,
        phone: createCustomerSupplierDto.phone,
        email: createCustomerSupplierDto.email,
        isSupplier: createCustomerSupplierDto.isSupplier || false,
      },
    });
  }

  async findAll() {
    return this.prisma.customerSupplier.findMany();
  }

  async findOne(id: number) {
    return this.prisma.customerSupplier.findUnique({
      where: { id: id },
    });
  }

  async update(id: number, updateCustomerSupplierDto: UpdateCustomerSupplierDto) {
    return this.prisma.customerSupplier.update({
      where: { id: id },
      data: {
        title: updateCustomerSupplierDto.title,
        taxOffice: updateCustomerSupplierDto.taxOffice,
        taxNumber: updateCustomerSupplierDto.taxNumber,
        address: updateCustomerSupplierDto.address,
        countryCode: updateCustomerSupplierDto.countryCode,
        phone: updateCustomerSupplierDto.phone,
        email: updateCustomerSupplierDto.email,
        isSupplier: updateCustomerSupplierDto.isSupplier,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.customerSupplier.delete({
      where: { id: id },
    });
  }

  async findByTaxNumber(taxNumber: string) {
    return this.prisma.customerSupplier.findMany({
      where: {
        taxNumber: {
          contains: taxNumber
        }
      }
    });
  }

  async search(term: string) {
    return this.prisma.customerSupplier.findMany({
      where: {
        OR: [
          { title: { contains: term } },
          { taxNumber: { contains: term } },
        ]
      }
    });
  }
}