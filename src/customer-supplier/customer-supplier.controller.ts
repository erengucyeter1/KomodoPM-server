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
  UseGuards,
  NotFoundException 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CustomerSupplierService } from './customer-supplier.service';
import { CreateCustomerSupplierDto } from './dto/create-customer-supplier.dto';
import { UpdateCustomerSupplierDto } from './dto/update-customer-supplier.dto';

@ApiTags('customer-supplier')
@Controller('customer-supplier')
export class CustomerSupplierController {
  constructor(private readonly customerSupplierService: CustomerSupplierService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni müşteri/tedarikçi oluştur' })
  @ApiResponse({ status: 201, description: 'Müşteri/tedarikçi başarıyla oluşturuldu' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  async create(@Body() createCustomerSupplierDto: CreateCustomerSupplierDto) {
    return this.customerSupplierService.create(createCustomerSupplierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm müşteri/tedarikçileri getir' })
  async findAll() {
    return this.customerSupplierService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Müşteri/tedarikçi ara' })
  @ApiQuery({ name: 'term', required: true, type: String })
  async search(@Query('term') term: string) {
    return this.customerSupplierService.search(term);
  }

  @Get('tax/:taxNumber')
  @ApiOperation({ summary: 'Vergi numarasına göre müşteri/tedarikçi getir' })
  @ApiResponse({ status: 200, description: 'Müşteri/tedarikçi bulundu' })
  async findByTaxNumber(@Param('taxNumber') taxNumber: string) {
    return this.customerSupplierService.findByTaxNumber(taxNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID ile müşteri/tedarikçi getir' })
  @ApiResponse({ status: 200, description: 'Müşteri/tedarikçi bulundu' })
  @ApiResponse({ status: 404, description: 'Müşteri/tedarikçi bulunamadı' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.customerSupplierService.findOne(id);
    if (!result) {
      throw new NotFoundException(`Müşteri/tedarikçi ID:${id} bulunamadı`);
    }
    return result;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Müşteri/tedarikçi bilgilerini güncelle' })
  @ApiResponse({ status: 200, description: 'Müşteri/tedarikçi güncellendi' })
  @ApiResponse({ status: 404, description: 'Müşteri/tedarikçi bulunamadı' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerSupplierDto: UpdateCustomerSupplierDto
  ) {
    const customer = await this.customerSupplierService.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Müşteri/tedarikçi ID:${id} bulunamadı`);
    }
    return this.customerSupplierService.update(id, updateCustomerSupplierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Müşteri/tedarikçi sil' })
  @ApiResponse({ status: 200, description: 'Müşteri/tedarikçi silindi' })
  @ApiResponse({ status: 404, description: 'Müşteri/tedarikçi bulunamadı' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.customerSupplierService.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Müşteri/tedarikçi ID:${id} bulunamadı`);
    }
    return this.customerSupplierService.remove(id);
  }
}