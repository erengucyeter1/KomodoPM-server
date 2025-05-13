import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Injectable()
export class StockService {

  constructor(private readonly prismaService: PrismaService) {}

  async create(createStockDto: CreateStockDto) {

    // Check if the stock code already exists
    const existingStock = await this.prismaService.product.findUnique({
      where: {
        stock_code: createStockDto.stockCode,
      },
    });

    if (existingStock) {
      throw new Error(`Stock code ${createStockDto.stockCode} already exists.`);
    }
    
    return this.prismaService.product.create({
      data: {
        stock_code: createStockDto.stockCode,
        measurement_unit: createStockDto.mesurementUnit,
        description: createStockDto.description,
      },
    });
  }

  // Stock Service
  async findAll(options: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    filter?: string;
    isServiceOnly?: boolean;
  }) {
    const { page, limit, sortBy = 'stock_code', sortOrder = 'ASC', filter, isServiceOnly } = options;
    
    // Build where condition for filtering
    let where: Prisma.ProductWhereInput = {};
    const conditions: Prisma.ProductWhereInput[] = [];

    if (isServiceOnly) {
      conditions.push({ isService: true });
    }
    
    if (filter) {
      // Use only fields that are string-searchable and apply case-insensitive search
      conditions.push({
        OR: [
          { stock_code: { contains: filter, mode: 'insensitive' } },
          { description: { contains: filter, mode: 'insensitive' } }
        ]
      });
    }

    if (conditions.length > 0) {
      where = { AND: conditions };
    }
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Get total count with the corrected where clause
    const totalItems = await this.prismaService.product.count({ where });
    
    // Convert sortOrder string to Prisma.SortOrder enum
    const sortDirection = sortOrder === 'DESC' ? Prisma.SortOrder.desc : Prisma.SortOrder.asc;
    
    // Create dynamic orderBy object
    const orderBy: any = {
      [sortBy]: sortDirection
    };
    
    // Get items for current page
    const items = await this.prismaService.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        stock_code: true,
        measurement_unit: true,
        description: true,
        balance: true,
      }
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    
    // Return paginated result with metadata
    return {
      items,
      meta: {
        totalItems,
        itemsPerPage: limit,
        currentPage: page,
        totalPages,
      }
    };
  }

  async findOne(stock_code: string) {
    const product = await this.prismaService.product.findUnique({
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

    if (!product) {
      throw new BadRequestException('Ürün bulunamadı');
    }

    return product;
}

  update(stock_code: string, updateStockDto: UpdateStockDto) {
    return this.prismaService.product.update({
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
    return this.prismaService.product.delete({
      where: {
        stock_code: stock_code,
      },
    });
  }
}
