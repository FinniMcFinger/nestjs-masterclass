import {Injectable} from "@nestjs/common";
import {UsersService} from "../../users/providers/users.service";
import {CreatePostDto} from "../dtos/create-post.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Post} from "../post.entity";
import {Repository} from "typeorm";

@Injectable()
export class PostsService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>
    ){}

    // lengthy creation method without cascades
    public async create(createPostDto: CreatePostDto) {
        let author = await this.usersService.findById(createPostDto.authorId);
        let newPost = this.postsRepository.create({
            ...createPostDto,
            author: author,
        });

        return await this.postsRepository.save(newPost);
    }

    public async findAll(userId: number) {
        const user = this.usersService.findById(userId);
        let posts = await this.postsRepository.find({
            // affect eager loading explicitly
            // relations: {
            //     metaOptions: true,
            //     author: true,
            // },
        });

        return posts;
    }

    public async delete(postId: number) {
        await this.postsRepository.delete(postId);

        return { deleted: true, id: postId };
    }
}