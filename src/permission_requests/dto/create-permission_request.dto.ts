import { IsNotEmpty, IsString, IsNumber  } from "class-validator";

export class CreatePermissionRequestDto {

    @IsNotEmpty()
    @IsNumber()
    project_expense_id: number;

    @IsNotEmpty()
    @IsNumber()
    old_quantity: number;

    @IsNotEmpty()
    @IsNumber()
    new_quantity: number;

    @IsNotEmpty()
    @IsNumber()
    applicant_id: number;

    @IsNotEmpty()
    @IsNumber()
    expense_creator_id: number;
    
}
