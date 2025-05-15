import { Injectable } from '@nestjs/common';
import { CreatePermissionRequestDto } from './dto/create-permission_request.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class PermissionRequestsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPermissionRequestDto: CreatePermissionRequestDto) {
    return  this.prisma.expense_update_attempt.create({
      data: {
        applicant_id: createPermissionRequestDto.applicant_id,
        expense_creator_id: createPermissionRequestDto.expense_creator_id,
        project_expense_id: createPermissionRequestDto.project_expense_id,
        new_quantity: createPermissionRequestDto.new_quantity,
        old_quantity: createPermissionRequestDto.old_quantity,
      }
    });
  }

  
}
