import { Injectable } from '@nestjs/common';
import { Prisma, user } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import {UpdateUserRolesDto} from './dto/update-user-roles.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }



    async findOne(params: Prisma.userWhereUniqueInput): Promise<user | null> {
        return this.prisma.user.findUnique({ where: params });
    }

    async findAll(): Promise<user[]> {
        return this.prisma.user.findMany();
    }

    async findChat(user: UserEntity): Promise<user[]> {

        console.log(user.username)
        const senders: { senderId: number }[] = await this.prisma.$queryRaw`
        SELECT DISTINCT "senderId"
        FROM "message"
        WHERE "recipientId" = ${user.id}::bigint
        `


        return await this.prisma.user.findMany({
            where: {
                id: {
                    in: senders.map((s: any) => s.senderId),
                },
            },
        });
            

        
    }

    async create(data: CreateUserDto): Promise<user> {

        const roundsOfHashing = process.env.RoundsOfHashing;
        const hashedPassword = await bcrypt.hash(
            data.password,
            Number(roundsOfHashing)
        );

        data.password = hashedPassword;
        return this.prisma.user.create({ data });
    }


    async update(id: number, params: UpdateUserDto): Promise<user> {
        // Verileri temizleme işlemi
        const cleanData = this.cleanUpdateData(params);

        // Eğer şifre güncellenmişse, onu da hash'le
        if (params.password) {
            const roundsOfHashing = process.env.RoundsOfHashing;
            cleanData.password = await bcrypt.hash(
                params.password,
                Number(roundsOfHashing)
            );
        }

        return this.prisma.user.update({
            where: { id },
            data: cleanData
        });
    }

    async remove(id: number): Promise<user> {
        return this.prisma.user.delete({ where: { id } });
    }


    // Gelen verileri temizleyip uygun türlere dönüştüren yardımcı metod
    private cleanUpdateData(data: any): any {
        const { password, ...cleanedData } = data;

        if (data.authorization_rank !== undefined) {
            cleanedData.authorization_rank = Number(data.authorization_rank);
        }

        // Gelecekte başka sayısal alanlar için dönüşümler eklenebilir

        return cleanedData;
    }





    /// roles

    async updateUserRoles(updateUserRolesDto: UpdateUserRolesDto): Promise<user> {
        const { username, roles } = updateUserRolesDto;
    
        return await this.prisma.user.update({
            where: { username },
            data: {
                roles: {
                    set: roles.map(id => ({ id })), // rol ID'leriyle ilişkilendir
                },
            },
            include: {
                roles: true, // Güncellenmiş rolleri dahil et (isteğe bağlı)
            },
        }).catch((error) => {
            console.error("Error updating user roles:", error);
            throw new Error("User roles update failed");
        });
    }
    

    async getUserRoleIDs(id: number): Promise<{ roles: number[] } | null> {
        const user = await this.prisma.user.findUnique({
          where: { id },
          select: {
            roles: {
              select: {
                id: true,
              },
            },
          },
        });
      
        if (!user) return null;
      
        return {
          roles: user.roles.map(role => Number(role.id)),
        };
      }
      

    
}
