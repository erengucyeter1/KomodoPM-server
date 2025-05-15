import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TrailersService } from './trailers.service';
import { CreateTreylerDto } from './dto/create-trailers.dto';
import { UpdateTreylerDto } from './dto/update-trailers.dto';

@Controller('trailers')
export class TrailersContoller {
  constructor(private readonly treylersService: TrailersService) {}

  @Post()
  create(@Body() createTreylerDto: CreateTreylerDto) {
    return this.treylersService.create(createTreylerDto);
  }

  @Get()
  findAll(@Query('classFilter') classFilter: string) {
    return this.treylersService.findAll(classFilter);
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
