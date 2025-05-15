import { Injectable } from '@nestjs/common';
import { CreatePermissionRequestDto } from './dto/create-permission_request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePermissionRequestDto } from './dto/update-permission_request.dto';


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
        success: false

      }
    }


    const newAttempt = await this.prisma.expense_update_attempt.create({
      data: {
        applicant_id: createPermissionRequestDto.applicant_id,
        expense_creator_id: createPermissionRequestDto.expense_creator_id,
        project_expense_id: createPermissionRequestDto.project_expense_id,
        new_quantity: createPermissionRequestDto.new_quantity,
        old_quantity: createPermissionRequestDto.old_quantity,
      }

    });

    return {
      message: 'İzin talebi başarıyla oluşturuldu.',
      success: true,
      data: newAttempt
    }
  }


  async update(id: number, updatePermissionRequestDto: UpdatePermissionRequestDto) {
    const response = await this.prisma.expense_update_attempt.update({
      where: { id: id },
      data: {
        status: updatePermissionRequestDto.status
      }
    });

    return {
      message: 'İzin talebi başarıyla güncellendi.',
      success: true,
      data: response
    }
  }

  
}
