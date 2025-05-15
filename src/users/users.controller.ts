import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  
} from '@nestjs/common';
import { UsersService } from './users.service';

import { UserEntity } from './entities/user.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';

import {Permissions} from '../common/decorators/permissions/permissions.decorator';
import { GetUser } from 'src/common/decorators/users/user.decorator';


@Controller('users')
@ApiTags('users')
export class UserController {

  constructor(private readonly usersService: UsersService) { }

  @Post()
  
  @Permissions(['create:user'])
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }


  @Get()
  
  @Permissions(['see:users'])
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get('chat')
  
  @Permissions(['see:chat'])
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAllChat(@GetUser() user: UserEntity) {

    if(user?.permissions.includes('send:message') || user?.permissions.includes('admin')) {
      return this.usersService.findAll();
    }

    return this.usersService.findChat(user);

  }

  @Get(':id')
  
  @Permissions(['see:users'])
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne({ id });
    return new UserEntity(user);
  }


  @Patch(':id')
  @Permissions(['update:user'])
  
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  
  @Permissions(['delete:user'])
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.remove(id));
  }

  @Patch('roles/update')
  
  @Permissions(['update:user_roles'])
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async updateRoles(@Body() updateUserRolesDto: UpdateUserRolesDto) {
    // Ensure roles are processed correctly regardless of type
    if (updateUserRolesDto.roles && Array.isArray(updateUserRolesDto.roles)) {
      updateUserRolesDto.roles = updateUserRolesDto.roles.map(role => 
        typeof role === 'string' ? parseInt(role, 10) : Number(role)
      );
    }
      
    return new UserEntity(
      await this.usersService.updateUserRoles(updateUserRolesDto),
    );
  }


  @Get(':id/roles')
  
  @Permissions(['see:user_roles'])
  @ApiBearerAuth()
  @ApiOkResponse({ type: Object, isArray: true })
  async getUserRoles(@Param('id', ParseIntPipe) id: number) {
    const roles = await this.usersService.getUserRoleIDs(id);
    return roles;
  }

}

