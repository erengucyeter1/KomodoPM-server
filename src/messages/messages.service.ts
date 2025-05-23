import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}
  
  async update( updateMessageDto: UpdateMessageDto) {
    
    const message = await this.prisma.message.findUnique({
      where: { id: updateMessageDto.id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const metadata = message.metadata as any;
    const newMetadata = {
      ...metadata,
      status: updateMessageDto.status
    }

    const response = await this.prisma.message.update({
      where: { id: updateMessageDto.id },
      data: {
        metadata: newMetadata
      }
    });

    return {
      message: 'Message updated successfully',
      data: response,
      success: true
    }
  }

}
