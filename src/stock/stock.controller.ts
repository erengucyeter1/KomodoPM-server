import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query, ParseBoolPipe } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Post('bulk')
  async createBulk(@Body() createStockDtos: CreateStockDto[]) {
    const results = await Promise.allSettled(
      createStockDtos.map(stock => this.stockService.create(stock))
    );
    
    // Filter successful creations
    const createdStocks = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);
    
    
    return createdStocks;
  }
    

  // Backend pagination endpoint (NestJS example)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number = 25,
    @Query('sortBy') sortBy: string = 'stock_code',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('filter') filter?: string,
    @Query('isServiceOnly', new DefaultValuePipe(false), ParseBoolPipe) isServiceOnly?: boolean,
    @Query('balanceGreaterThan', new DefaultValuePipe(undefined), ParseIntPipe) balanceGreaterThan?: number,
  ) {
    return this.stockService.findAll({
      page,
      limit,
      sortBy,
      sortOrder,
      filter,
      isServiceOnly,
      balanceGreaterThan,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(id);
  }
}
