import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsNumber()
  creator_id: number; // User ID creating the project

  @IsNotEmpty()
  @IsNumber()
  treyler_type_id: number; // Treyler model ID
  
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsNotEmpty()
  @IsString()
  customer_name: string;
  
  @IsNotEmpty()
  @IsDateString()
  end_date: string;
  
  @IsNotEmpty()
  @IsString()
  status: string;
  
  @IsNotEmpty()
  @IsNumber()
  budget: number;
  
  @IsOptional()
  @IsString()
  description?: string;
}