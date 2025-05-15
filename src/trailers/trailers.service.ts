import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTreylerDto } from './dto/create-trailers.dto';
import { UpdateTreylerDto } from './dto/update-trailers.dto';
import { trailer_class } from '@prisma/client';

@Injectable()
export class TrailersService {
  constructor(private prisma: PrismaService) {}
  
  async create(createTreylerDto: CreateTreylerDto) {
    const { name, description, imageData, contentType } = createTreylerDto;
    
    return this.prisma.treyler_type.create({
      data: {
        name,
        description,
        image_data: imageData,
        class: createTreylerDto.class as trailer_class,
        image_content_type: contentType || 'image/jpeg', // Default if not provided
      },
    });
  }

  async findAll(classFilter: string | undefined) {
    if (classFilter) {
      return this.prisma.treyler_type.findMany({
        where: {
          class: classFilter as trailer_class,
        },
      });
    }
    
    return this.prisma.treyler_type.findMany();
  }

  async findOne(id: number) {
    return this.prisma.treyler_type.findUnique({
      where: { id: BigInt(id) },
    });
  }

  async update(id: number, updateTreylerDto: UpdateTreylerDto) {
    const { name, description, imageData, contentType } = updateTreylerDto;
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (imageData !== undefined) updateData.image_data = imageData;
    if (contentType !== undefined) updateData.image_content_type = contentType;
    
    return this.prisma.treyler_type.update({
      where: { id: BigInt(id) },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.treyler_type.delete({
      where: { id: BigInt(id) },
    });
  }
}