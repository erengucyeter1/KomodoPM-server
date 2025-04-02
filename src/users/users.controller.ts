import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { UserEntity } from './entities/user.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';


import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';


@Controller('users')
@ApiTags('users')
export class UserController {

  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne({ id });
    return new UserEntity(user);
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.remove(id));
  }

  @Patch('roles/update')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity })
  async updateRoles(@Body() updateUserRolesDto: UpdateUserRolesDto) {
    // Ensure roles are processed correctly regardless of type
    if (updateUserRolesDto.roles && Array.isArray(updateUserRolesDto.roles)) {
      // Explicitly convert each role to number to ensure proper typing
      updateUserRolesDto.roles = updateUserRolesDto.roles.map(role => 
        typeof role === 'string' ? parseInt(role, 10) : Number(role)
      );
    }
    
    console.log('Processing role update with payload:', updateUserRolesDto);
    
    return new UserEntity(
      await this.usersService.updateUserRoles(updateUserRolesDto),
    );
  }


  @Get(':id/roles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Object, isArray: true })
  async getUserRoles(@Param('id', ParseIntPipe) id: number) {
    const roles = await this.usersService.getUserRoles(id);
    return roles;
  }

}

