import { Injectable } from '@nestjs/common';
import { Prisma, user } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

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
            data.hash_password,
            Number(roundsOfHashing)
        );

        data.hash_password = hashedPassword;
        return this.prisma.user.create({ data });
    }


    async update(id: number, params: UpdateUserDto): Promise<user> {
        // Verileri temizleme işlemi
        const cleanData = this.cleanUpdateData(params);

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
        const cleanedData = { ...data };

        if (data.authorization_rank !== undefined) {
            cleanedData.authorization_rank = Number(data.authorization_rank);
        }

        // Gelecekte başka sayısal alanlar için dönüşümler eklenebilir

        return cleanedData;
    }
}
