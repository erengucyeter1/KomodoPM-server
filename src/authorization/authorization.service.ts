import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from './../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class AuthorizationService {
  constructor(private prisma: PrismaService) { }

  async createPermission(data: CreatePermissionDto) {

    const name = data.name;

    const permission = this.findOnePermission(name);


    if (!permission) {
      return ({ status: 400, message: "Permission already exists" });
    }

    await this.prisma.permissions.create({ data });



    return ({ status: 200, message: "Permission created successfully" });
  }

  async findAllPermissions() {
    return await this.prisma.permissions.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  async findOnePermission(name: string) {
    return await this.prisma.permissions.findUnique({
      where: {
        name: name,
      },
    });
  }


  async removePermission(id: number) {
    const permission = await this.prisma.permissions.findUnique({
      where: {
        id: id,
      },
    });
    if (!permission) {
      return ({ status: 400, message: "Permission not found" });
    }
    await this.prisma.permissions.delete({
      where: {
        id: id,
      },
    });
    return ({ status: 200, message: "Permission deleted successfully" });
  }

  async updatePermission(id: number, updatePermissionDto: UpdatePermissionDto) {

    const permission = await this.prisma.permissions.findUnique({
      where: {
        id: id,
      },
    });

    if (!permission) {
      return ({ status: 400, message: "Permission not found" });
    }

    await this.prisma.permissions.update({
      where: {
        id: id,
      },
      data: updatePermissionDto,
    });

    return ({ status: 200, message: "Permission updated successfully" });
  }


  async findAllRoles() {
    try {
      // Veritabanı sorgusu yapmaya çalış
      const roles = await this.prisma.role.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          permissionIDs: true,
        },
      });

      return roles;
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }


  async findOneRole(name: string) {
    return await this.prisma.role.findUnique({
      where: {
        name: name,
      },
    });
  }


  async createRole(data: CreateRoleDto) {

    const name = data.name;
    const role = this.findOnePermission(name);

    if (!role) {
      return ({ status: 400, message: "Role already exists" });
    }

    await this.prisma.role.create({ data });

    return ({ status: 200, message: "Role created successfully" });
  }


  async updateRole(id: number, data: CreateRoleDto) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
    });

    if (!role) {
      return ({ status: 400, message: "Role not found" });
    }

    await this.prisma.role.update({
      where: {
        id: id,
      },
      data: data,
    });

    return ({ status: 200, message: "Role updated successfully" });
  }
  async deleteRole(id: number) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
    });

    if (!role) {
      return ({ status: 400, message: "Role not found" });
    }

    await this.prisma.role.delete({
      where: {
        id: id,
      },
    });

    return ({ status: 200, message: "Role deleted successfully" });
  }

}
