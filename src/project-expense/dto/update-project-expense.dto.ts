import { PartialType } from '@nestjs/swagger';
import { CreateProjectExpenseDto } from './create-project-expense.dto';

export class UpdateProjectExpenseDto extends PartialType(CreateProjectExpenseDto) {}
