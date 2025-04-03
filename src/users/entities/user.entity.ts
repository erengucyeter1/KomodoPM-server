
export class UserEntity {
    constructor(
        user: any,
        permissionNames: string[] = [],
    ) {
        this.id = user.id.toString();
        this.username = user.username;
        this.name = user.name;
        this.surname = user.surname;
        this.email = user.email;
        this.permissions = permissionNames;
        this.roles = user.roles;
        this.authorization_rank = user.authorization_rank;
    }
    id: string;
    username: string;
    name: string;
    surname: string;
    email: string;
    permissions: string[];
    roles: number[];
    authorization_rank: number;
}

