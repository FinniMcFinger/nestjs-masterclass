import {Injectable} from "@nestjs/common";
import {UsersService} from "../../users/providers/users.service";

@Injectable()
export class PostsService {
    constructor(private readonly usersService: UsersService) {}

    public findAll(userId: number) {
        const user = this.usersService.findById(userId);

        return [
            {
                user,
                title: "Title",
                content: "lorem ipsum",
            },
            {
                user,
                title: "Title 2",
                content: "dolor sit amet",
            },
        ]
    }
}