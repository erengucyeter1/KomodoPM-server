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

    await this.prisma.permission.create({ data });



    return ({ status: 200, message: "Permission created successfully" });
  }

  async findAllPermissions() {
    return await this.prisma.permission.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  async findOnePermission(name: string) {
    return await this.prisma.permission.findUnique({
      where: {
        name: name,
      },
    });
  }


  async removePermission(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: {
        id: id,
      },
    });
    if (!permission) {
      return ({ status: 400, message: "Permission not found" });
    }
    await this.prisma.permission.delete({
      where: {
        id: id,
      },
    });
    return ({ status: 200, message: "Permission deleted successfully" });
  }

  async updatePermission(id: number, updatePermissionDto: UpdatePermissionDto) {

    const permission = await this.prisma.permission.findUnique({
      where: {
        id: id,
      },
    });

    if (!permission) {
      return ({ status: 400, message: "Permission not found" });
    }

    await this.prisma.permission.update({
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
          permissions: true,
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
    const { name, description, permissions} = data;
  
    console.log("PERMİSSİON IDS", permissions);
    // 1. Rol zaten var mı kontrolü
    const existingRole = await this.prisma.role.findUnique({
      where: { name },
    });
  
    if (existingRole) {
      return { status: 400, message: "Role already exists" };
    }
  
    // 2. Permission ID'lerine göre connect nesneleri oluştur
    const permissionsToConnect = permissions.map(id => ({ id }));
  
    // 3. Rol oluştur ve permission'ları bağla
    await this.prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          connect: permissionsToConnect,
        },
      },
    });
  
    return { status: 200, message: "Role created successfully" };
  }
  


  async updateRole(id: number, data: CreateRoleDto) {

    const { name, description, permissions } = data;

    const permissionsToConnect = permissions.map(id => ({ id }));


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
      data: {
        name,
        description,
        permissions: {
          connect: permissionsToConnect,
        },
      },
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
