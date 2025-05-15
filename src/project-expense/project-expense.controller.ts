import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ProjectExpenseService } from './project-expense.service';
import { CreateProjectExpenseDto } from './dto/create-project-expense.dto';
import { UpdateProjectExpenseDto } from './dto/update-project-expense.dto';

@Controller('project-expense')
export class ProjectExpenseController {
  constructor(private readonly projectExpenseService: ProjectExpenseService) {}

  @Post()
  create(@Body() createProjectExpenseDto: CreateProjectExpenseDto) {
    return this.projectExpenseService.create(createProjectExpenseDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectExpenseService.findOne(id);
  }

  @Get('project/:projectId')
  async findManyByProjectId(@Param('projectId') projectId: string) {
    return this.projectExpenseService.findManyByProjectId(Number(projectId));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProjectExpenseDto: UpdateProjectExpenseDto) {
    return this.projectExpenseService.update(id, updateProjectExpenseDto);
  }
}

  

