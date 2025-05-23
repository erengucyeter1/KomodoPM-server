import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions/permissions.decorator';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) { }

  
  @Post('/permissions')
  
  @Permissions(['add:permission'])
  @ApiBearerAuth()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.authorizationService.createPermission(createPermissionDto);
  }

 
  @Get("/permissions")
  
  @Permissions(['see:permissions'])
  @ApiBearerAuth()
  async findAll() {
    return await this.authorizationService.findAllPermissions();
  }

  @Patch('/permissions/:id')
  
  @Permissions(['update:permissions'])
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {

    return await this.authorizationService.updatePermission(+id, updatePermissionDto);
  }

  @Delete('/permissions/:id')
  
  @Permissions(['delete:permission'])
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.authorizationService.removePermission(+id);
  }



  // roles

  @Get('/roles')
  
  @Permissions(['see:roles'])
  @ApiBearerAuth()
  async findAllRoles() {
    return await this.authorizationService.findAllRoles();
  }

  @Post('/roles')
  
  @Permissions(['add:role'])
  @ApiBearerAuth()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    console.log("CREATE ROLE DTO", createRoleDto);
    return await this.authorizationService.createRole(createRoleDto);
  }

  @Put('/roles/:id')
  
  @Permissions(['update:role'])
  @ApiBearerAuth()
  async updateRole(@Param('id') id: string, @Body() createRoleDto: CreateRoleDto) {
    return await this.authorizationService.updateRole(+id, createRoleDto);
  }
  @Delete('/roles/:id')
  
  @Permissions(['delete:role'])
  @ApiBearerAuth()
  async deleteRole(@Param('id') id: string) {
    return await this.authorizationService.deleteRole(+id);
  }




}
