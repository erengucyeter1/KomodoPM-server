import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions/permissions.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) { }

  
  @Post('/permissions')
  @UseGuards(JwtAuthGuard)
  @Permissions(['add:permission'])
  @ApiBearerAuth()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.authorizationService.createPermission(createPermissionDto);
  }

 
  @Get("/permissions")
  @UseGuards(JwtAuthGuard)
  @Permissions(['see:permissions'])
  @ApiBearerAuth()
  async findAll() {
    return await this.authorizationService.findAllPermissions();
  }

  @Patch('/permissions/:id')
  @UseGuards(JwtAuthGuard)
  @Permissions(['update:permissions'])
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {

    return await this.authorizationService.updatePermission(+id, updatePermissionDto);
  }

  @Delete('/permissions/:id')
  @UseGuards(JwtAuthGuard)
  @Permissions(['delete:permission'])
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.authorizationService.removePermission(+id);
  }



  // roles

  @Get('/roles')
  @UseGuards(JwtAuthGuard)
  @Permissions(['see:roles'])
  @ApiBearerAuth()
  async findAllRoles() {
    return await this.authorizationService.findAllRoles();
  }

  @Post('/roles')
  @UseGuards(JwtAuthGuard)
  @Permissions(['add:role'])
  @ApiBearerAuth()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.authorizationService.createRole(createRoleDto);
  }

  @Put('/roles/:id')
  @UseGuards(JwtAuthGuard)
  @Permissions(['update:role'])
  @ApiBearerAuth()
  async updateRole(@Param('id') id: string, @Body() createRoleDto: CreateRoleDto) {
    return await this.authorizationService.updateRole(+id, createRoleDto);
  }
  @Delete('/roles/:id')
  @UseGuards(JwtAuthGuard)
  @Permissions(['delete:role'])
  @ApiBearerAuth()
  async deleteRole(@Param('id') id: string) {
    return await this.authorizationService.deleteRole(+id);
  }




}
