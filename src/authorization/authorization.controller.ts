import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) { }

  @Post('/permission/new')
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.authorizationService.createPermission(createPermissionDto);
  }

  @Get("/permissions")
  async findAll() {
    return await this.authorizationService.findAllPermissions();
  }

  @Patch('/permissions/:id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {

    return await this.authorizationService.updatePermission(+id, updatePermissionDto);
  }

  @Delete('/permissions/:id')
  async remove(@Param('id') id: string) {
    return await this.authorizationService.removePermission(+id);
  }



  // roles

  @Get('/roles')
  async findAllRoles() {
    return await this.authorizationService.findAllRoles();
  }

  @Post('/roles')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.authorizationService.createRole(createRoleDto);
  }

  @Put('/roles/:id')
  async updateRole(@Param('id') id: string, @Body() createRoleDto: CreateRoleDto) {
    return await this.authorizationService.updateRole(+id, createRoleDto);
  }
  @Delete('/roles/:id')
  async deleteRole(@Param('id') id: string) {
    return await this.authorizationService.deleteRole(+id);
  }




}
