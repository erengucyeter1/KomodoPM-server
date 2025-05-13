import { Injectable } from '@nestjs/common';
import { Prisma, user } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import {UpdateUserRolesDto} from './dto/update-user-roles.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }



    async findOne(params: Prisma.userWhereUniqueInput): Promise<user | null> {
        return this.prisma.user.findUnique({ where: params });
    }

    async findAll(): Promise<user[]> {
        return this.prisma.user.findMany();
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
                roles: roles
            },
        }).catch((error) => {
            console.error("Error updating user roles:", error);
            throw new Error("User roles update failed");
        });
    }

    async getUserRoles(id: number): Promise<{ roles: number[] } | null> {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                roles: true,
            },
        });
    }

    
}
