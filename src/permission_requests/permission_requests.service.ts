import { Injectable } from '@nestjs/common';
import { CreatePermissionRequestDto } from './dto/create-permission_request.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class PermissionRequestsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPermissionRequestDto: CreatePermissionRequestDto) {

    const projectExpenseID = createPermissionRequestDto.project_expense_id;

    const OldAttempt = await this.prisma.expense_update_attempt.findFirst({
      where: {
        project_expense_id: projectExpenseID,
        status: 'pending'
      }
    });

    console.log(OldAttempt);

    if(OldAttempt){
      return {
        message: 'Bu gider için zaten bir izin talebi bekliyor.',
        status: 406
      }
    }


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
