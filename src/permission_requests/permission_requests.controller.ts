import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionRequestsService } from './permission_requests.service';
import { CreatePermissionRequestDto } from './dto/create-permission_request.dto';

@Controller('permission-requests')
export class PermissionRequestsController {
  constructor(private readonly permissionRequestsService: PermissionRequestsService) {}

  @Post()
  async create(@Body() createPermissionRequestDto: CreatePermissionRequestDto) {
    return await this.permissionRequestsService.create(createPermissionRequestDto);
  }

}
