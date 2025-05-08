import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerSupplierService } from './customer-supplier.service';
import { CreateCustomerSupplierDto } from './dto/create-customer-supplier.dto';
import { UpdateCustomerSupplierDto } from './dto/update-customer-supplier.dto';

@ApiTags('customer-supplier')
@Controller('customer-supplier')
@ApiBearerAuth()
export class CustomerSupplierController {
  constructor(private readonly customerSupplierService: CustomerSupplierService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni müşteri/tedarikçi oluştur' })
  @ApiResponse({ status: 201, description: 'Müşteri/tedarikçi başarıyla oluşturuldu' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  create(@Body() createCustomerSupplierDto: CreateCustomerSupplierDto) {
    return this.customerSupplierService.create(createCustomerSupplierDto);
  }

  /*@Get()
  @ApiOperation({ summary: 'Tüm müşteri/tedarikçileri getir' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  @ApiQuery({ name: 'isSupplier', required: false, type: Boolean })
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filter') filter?: string,
    @Query('isSupplier') isSupplier?: boolean
  ) {
    return this.customerSupplierService.findAll(
      skip ? Number(skip) : 0, 
      take ? Number(take) : 10, 
      filter,
      isSupplier !== undefined ? isSupplier === true : undefined
    );
  } */

  @Get(':id')
  @ApiOperation({ summary: 'ID ile müşteri/tedarikçi getir' })
  @ApiResponse({ status: 200, description: 'Müşteri/tedarikçi bulundu' })
  @ApiResponse({ status: 404, description: 'Müşteri/tedarikçi bulunamadı' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customerSupplierService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Müşteri/tedarikçi bilgilerini güncelle' })
  @ApiResponse({ status: 200, description: 'Müşteri/tedarikçi güncellendi' })
  @ApiResponse({ status: 404, description: 'Müşteri/tedarikçi bulunamadı' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerSupplierDto: UpdateCustomerSupplierDto
  ) {
    return this.customerSupplierService.update(id, updateCustomerSupplierDto);
  }

  /*@Delete(':id')
  @ApiOperation({ summary: 'Müşteri/tedarikçi sil' })
  @ApiResponse({ status: 200, description: 'Müşteri/tedarikçi silindi' })
  @ApiResponse({ status: 404, description: 'Müşteri/tedarikçi bulunamadı' })
  @ApiResponse({ status: 400, description: 'İlişkili faturalar olduğu için silinemez' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerSupplierService.remove(id);
  }*/
}