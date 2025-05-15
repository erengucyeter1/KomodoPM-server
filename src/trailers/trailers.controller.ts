import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TrailersService } from './trailers.service';
import { CreateTreylerDto } from './dto/create-trailers.dto';
import { UpdateTreylerDto } from './dto/update-trailers.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/common/decorators/permissions/permissions.decorator';
@Controller('trailers')
export class TrailersContoller {
  constructor(private readonly treylersService: TrailersService) {}

  @Post()
  
  @Permissions(['create:trailer'])
  @ApiBearerAuth()
  create(@Body() createTreylerDto: CreateTreylerDto) {
    return this.treylersService.create(createTreylerDto);
  }

  @Get()
  
  @Permissions(['see:trailers'])
  @ApiBearerAuth()
  findAll(@Query('classFilter') classFilter: string) {
    return this.treylersService.findAll(classFilter);
  }

  @Get(':id')
  
  @Permissions(['see:trailer'])
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.treylersService.findOne(+id);
  }

  @Patch(':id')
  
  @Permissions(['update:trailer'])
  @ApiBearerAuth()

  update(@Param('id') id: string, @Body() updateTreylerDto: UpdateTreylerDto) {
    return this.treylersService.update(+id, updateTreylerDto);
  }

  @Delete(':id')
  
  @Permissions(['delete:trailer'])
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.treylersService.remove(+id);
  }
}
