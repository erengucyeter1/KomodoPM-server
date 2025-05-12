import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectExpenseDto } from './dto/create-project-expense.dto';
import { UpdateProjectExpenseDto } from './dto/update-project-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectExpenseService {
  constructor(private prisma: PrismaService) {}
  async create(createProjectExpenseDto: CreateProjectExpenseDto) {


     const product = await this.prisma.product.findUnique({
      where: { stock_code: createProjectExpenseDto.product_code },
      select: { balance: true },
    });


    if (!product) {
      throw new BadRequestException('Bu numara ile fatura bulunamadı.');
    }

    if (product && product.balance.lessThan(createProjectExpenseDto.product_count)) {
      throw new BadRequestException('Yetersiz bakiye.');
    }


    
    const project_expense = await this.prisma.project_expenses.create({
      data: {
        creator_id: createProjectExpenseDto.creator_id,
        project_id: createProjectExpenseDto.project_id,
        product_code: createProjectExpenseDto.product_code,
        quantity: createProjectExpenseDto.product_count,
      }
    }).then((result) => {
      console.log(result);
    }
    ).catch((error) => {
      console.log(error);
    });

   

    const newBalance = product.balance.minus(createProjectExpenseDto.product_count); 
    await this.prisma.product.update({
      where: { stock_code: createProjectExpenseDto.product_code },
      data: { balance: newBalance },
    });

    return project_expense;
  }

  async findManyByProjectId(project_id: number) {
    return  await this.prisma.project_expenses.findMany({
      where: { project_id: project_id },
      include: {
        product: true,
        user: true,
      },
    });

  

 
}
}