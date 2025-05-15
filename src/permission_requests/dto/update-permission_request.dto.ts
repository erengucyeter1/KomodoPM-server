import { PartialType } from '@nestjs/swagger';
import { CreatePermissionRequestDto } from './create-permission_request.dto';

export class UpdatePermissionRequestDto extends PartialType(CreatePermissionRequestDto) {
    status: 'pending' | 'approved' | 'rejected';
}
