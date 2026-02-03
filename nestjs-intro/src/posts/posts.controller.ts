import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {PostsService} from "./providers/posts.service";
import {CreatePostDto} from "./dtos/create-post.dto";

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get("{/:userId}")
    public getPosts(@Param('userId') userId: number) {
        return this.postsService.findAll(userId);
    }

    @Post(":userId")
    public createPost(@Body() createPostDto: CreatePostDto, @Param('userId') userId: number) {
        console.log(createPostDto);
        console.log(userId);

        return "Great success!";
    }
}