import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TreylersService } from './treylers.service';
import { CreateTreylerDto } from './dto/create-treyler.dto';
import { UpdateTreylerDto } from './dto/update-treyler.dto';

@Controller('treylers')
export class TreylersController {
  constructor(private readonly treylersService: TreylersService) {}

  @Post()
  create(@Body() createTreylerDto: CreateTreylerDto) {
    return this.treylersService.create(createTreylerDto);
  }

  @Get()
  findAll() {
    return this.treylersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treylersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTreylerDto: UpdateTreylerDto) {
    return this.treylersService.update(+id, updateTreylerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.treylersService.remove(+id);
  }
}
