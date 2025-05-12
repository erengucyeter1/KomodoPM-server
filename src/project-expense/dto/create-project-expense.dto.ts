import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProjectExpenseDto {

    @IsNotEmpty()
    @IsNumber()
    creator_id: number;
    
    @IsNotEmpty()
    @IsNumber()
    project_id: number;

    @IsNotEmpty()
    @IsString()
    product_code: string;

    @IsNotEmpty()
    @IsNumber()
    product_count: number;

}
