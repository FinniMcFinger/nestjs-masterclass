import {Injectable} from "@nestjs/common";
import {UsersService} from "../../users/providers/users.service";
import {MetaOptionsService} from "../../meta-options/providers/meta-options.service";
import {CreatePostDto} from "../dtos/create-post.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Post} from "../post.entity";
import {Repository} from "typeorm";
import {MetaOption} from "../../meta-options/meta-option.entity";

@Injectable()
export class PostsService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
    ) {}

    // lengthy creation method without cascades
    public async create(createPostDto: CreatePostDto) {
        let newPost = this.postsRepository.create({...createPostDto});

        return await this.postsRepository.save(newPost);
    }

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