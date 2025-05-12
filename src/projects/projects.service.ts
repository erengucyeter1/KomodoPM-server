import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from './entities/project.entity';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      // Create the project with initial total_expenses = 0
      const project = await this.prisma.treyler_project.create({
        data: {
          creator_id: BigInt(createProjectDto.creator_id),
          treyler_type_id: BigInt(createProjectDto.treyler_type_id),
          name: createProjectDto.name,
          // String type için boş string kullan, null veya undefined yerine
          description: createProjectDto.description || "",
          customer_name: createProjectDto.customer_name,
          budget: new Decimal(createProjectDto.budget),
          total_expenses: new Decimal(0), // Initialize total expenses to zero
          status: createProjectDto.status,
          end_date: new Date(createProjectDto.end_date),
        },
        include: {
          user: true,
          treyler_type: true,
        },
      });

      // Convert BigInt to string for JSON serialization
      return this.mapProjectToEntity(project);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async findAll(): Promise<Project[]> {
    try {
      const projects = await this.prisma.treyler_project.findMany({
        include: {
          user: true,
          treyler_type: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return projects.map(project => this.mapProjectToEntity(project));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Project> {
    try {
      const project = await this.prisma.treyler_project.findUnique({
        where: {
          id: BigInt(id),
        },
        include: {
          user: true,
          treyler_type: true,
          project_expenses: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      return this.mapProjectToEntity(project);
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    try {
      // Check if project exists
      const existingProject = await this.prisma.treyler_project.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingProject) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      // Prepare update data
      const updateData: any = {};
      
      if (updateProjectDto.name !== undefined) updateData.name = updateProjectDto.name;
      if (updateProjectDto.description !== undefined) updateData.description = updateProjectDto.description;
      if (updateProjectDto.customer_name !== undefined) updateData.customer_name = updateProjectDto.customer_name;
      if (updateProjectDto.budget !== undefined) updateData.budget = new Decimal(updateProjectDto.budget);
      if (updateProjectDto.status !== undefined) updateData.status = updateProjectDto.status;
      if (updateProjectDto.end_date !== undefined) updateData.end_date = new Date(updateProjectDto.end_date);
      if (updateProjectDto.treyler_type_id !== undefined) updateData.treyler_type_id = BigInt(updateProjectDto.treyler_type_id);

      // Update the project
      const updatedProject = await this.prisma.treyler_project.update({
        where: { id: BigInt(id) },
        data: updateData,
        include: {
          user: true,
          treyler_type: true,
        },
      });

      return this.mapProjectToEntity(updatedProject);
    } catch (error) {
      console.error(`Error updating project with ID ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<Project> {
    try {
      // Check if project exists
      const existingProject = await this.prisma.treyler_project.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingProject) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      // Delete the project
      const deletedProject = await this.prisma.treyler_project.delete({
        where: { id: BigInt(id) },
        include: {
          user: true,
          treyler_type: true,
        },
      });

      return this.mapProjectToEntity(deletedProject);
    } catch (error) {
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    }
  }

  // Helper method to map database project to entity
  private mapProjectToEntity(project: any): Project {
    return {
      // Base project fields
      id: project.id.toString(),
      created_at: project.created_at,
      name: project.name,
      description: project.description,
      customer_name: project.customer_name,
      budget: project.budget,
      total_expenses: project.total_expenses,
      status: project.status,
      start_date: project.start_date || null,
      end_date: project.end_date,
      
      // Relationship IDs
      creator_id: project.creator_id.toString(),
      treyler_type_id: project.treyler_type_id.toString(),
      
      // Related data
      creator: project.user ? {
        id: project.user.id.toString(),
        name: project.user.name,
        surname: project.user.surname,
        username: project.user.username,
        email: project.user.email,
        role: project.user.authorization_rank.toString()
      } : undefined,
      
      treyler_type: project.treyler_type ? {
        id: project.treyler_type.id.toString(),
        name: project.treyler_type.name,
        description: project.treyler_type.description,
        image_data: project.treyler_type.image_data,
        image_content_type: project.treyler_type.image_content_type
      } : undefined,
      
      // Calculate the last updated date
      last_updated: project.updated_at || project.created_at,
      
    };
  }
}
