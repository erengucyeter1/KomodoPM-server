import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || '',
        });
    }

    async validate(payload: any) {
        const userID = payload.user.id ;
        const user = await this.usersService.findOne({ id: userID });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}