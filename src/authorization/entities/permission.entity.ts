import { ApiProperty } from '@nestjs/swagger';


export class Permission {

    @ApiProperty()
    id: number;

    @ApiProperty()
    permission_name: string;

    @ApiProperty()
    permission_description: string;
}
