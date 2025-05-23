// server/src/common/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity'; // Adjust path if necessary
import { parseJwt } from 'src/common/utils/jwtHelper';

/**
 * Custom decorator to extract the authenticated user object from the request.
 * Assumes that an authentication guard (like JwtAuthGuard based on JwtStrategy)
 * has already populated `request.user`.
 *
 * @param data - Optional property name from the user object to extract (e.g., 'id', 'email').
 *               If not provided, returns the entire user object.
 */
export const GetUser = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();


    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('JWT token not found');
    }

    const payload = parseJwt(token);
    
    const user = payload.user as UserEntity;

    if (!user) {
      // This should ideally not happen if the route is properly guarded
      // and the guard populates request.user.
      // Consider throwing an error or returning null/undefined based on your error handling strategy.
      return null; 
    }

    return data ? user?.[data] : user;
  },
);

