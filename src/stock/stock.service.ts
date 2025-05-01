import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {

  constructor(private readonly prismaService: PrismaService) {}

  create(createStockDto: CreateStockDto) {
    return this.prismaService.material.create({
      data: {
        stock_code: createStockDto.stockCode,
        measurement_unit: createStockDto.mesurementUnit,
        description: createStockDto.description,
      },
    });
    
    
  }

  findAll() {
    
    return this.prismaService.material.findMany({
      select: {
        stock_code: true,
        measurement_unit: true,
        description: true,
        balance: true,
      },
    });
  }

  findOne(stock_code: string) {
    return this.prismaService.material.findUnique({
      where: {
        stock_code: stock_code,
      },
      select: {
        stock_code: true,
        measurement_unit: true,
        description: true,
        balance: true,
      },
    });
  }

  update(stock_code: string, updateStockDto: UpdateStockDto) {
    return this.prismaService.material.update({
      where: {
        stock_code: stock_code,
      },
      data: {
        stock_code: updateStockDto.stockCode,
        measurement_unit: updateStockDto.mesurementUnit,
        description: updateStockDto.description,
      },
    });
  }

  remove(stock_code: string) {

    return this.prismaService.material.delete({
      where: {
        stock_code: stock_code,
      },
    });

  }
}
