import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectExpenseDto } from './dto/create-project-expense.dto';
import { UpdateProjectExpenseDto } from './dto/update-project-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

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

  async findOne(id: string) {
    return await this.prisma.project_expenses.findUnique({
      where: { id: Number(id) },
      include: {
        product: true,
        user: true,
      },
    });
  }

  async update(id: string, updateProjectExpenseDto: UpdateProjectExpenseDto) {

    const project_expense = await this.prisma.project_expenses.findUnique({
      where: { id: Number(id) },
    });

    if (!project_expense) {
      throw new BadRequestException('Bu numara ile gider bulunamadı.');
    }
    const product_code = project_expense?.product_code;
    const product = await this.prisma.product.findUnique({
      where: { stock_code: product_code },
      select: { balance: true },
    });

    if (!product) {
      console.log("product not found");
      return;
    }

    if(!updateProjectExpenseDto.product_count){
      throw new BadRequestException('Yeni miktar girilmedi.');
    }

    const product_balance = new Decimal(product.balance);
    const new_quantity = new Decimal(updateProjectExpenseDto.product_count);
    const old_quantity = new Decimal(project_expense.quantity);
    const difference = new_quantity.minus(old_quantity);

    console.log("difference: ", difference);
    console.log("product_balance: ", product_balance);
    console.log("new_quantity: ", new_quantity);
    console.log("old_quantity: ", old_quantity);

    if(difference.greaterThan(product_balance)){
      console.log("yetersiz bakiye");
      throw new BadRequestException('Yetersiz bakiye.');
    }

    const new_balance = product_balance.minus(difference);

    await this.prisma.product.update({
      where: { stock_code: product_code },
      data: { balance: new_balance },
    });

    const response = await this.prisma.project_expenses.update({
      where: { id: Number(id) },
      data: {
        quantity: new_quantity,
      },
    });

    return {
      message: 'Gider başarıyla güncellendi.',
      success: true,
      data: response
    }
  }
}