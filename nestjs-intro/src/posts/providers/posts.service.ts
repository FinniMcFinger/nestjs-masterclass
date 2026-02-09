import {Injectable} from "@nestjs/common";
import {UsersService} from "../../users/providers/users.service";
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
        @InjectRepository(MetaOption)
        private readonly metaOptionsRepository: Repository<MetaOption>,
    ) {}

    // lengthy creation method without cascades
    public async create(createPostDto: CreatePostDto) {
        let newPost = this.postsRepository.create({...createPostDto});

        return await this.postsRepository.save(newPost);
    }

    public async findAll(userId: number) {
        const user = this.usersService.findById(userId);
        let posts = await this.postsRepository.find({
            // affect eager loading explicitly
            // relations: {
            //     metaOptions: true
            // },
        });

        return posts;
    }

    // lengthy method because of unidirectional relation
    public async delete(postId: number) {
        let post = await this.postsRepository.findOneBy({ id: postId });
        let metaOptionsId = post?.metaOptions?.id;
        await this.postsRepository.delete(postId);
        if (metaOptionsId) await this.metaOptionsRepository.delete(metaOptionsId);

        return { deleted: true, id: postId };
    }
}