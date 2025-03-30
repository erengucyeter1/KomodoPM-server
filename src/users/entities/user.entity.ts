
export class UserEntity {
    constructor(
        user: any
    ) {
        this.id = user.id.toString();
        this.username = user.username;
        this.name = user.name;
        this.surname = user.surname;
        this.email = user.email;
        this.authorization_ids = user.authorization_ids;
        this.authorization_rank = user.authorization_rank;
    }
    id: string;
    username: string;
    name: string;
    surname: string;
    email: string;
    authorization_ids: number[];
    authorization_rank: number;
}

