import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {PostsService} from "./providers/posts.service";
import {CreatePostDto} from "./dtos/create-post.dto";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get("{/:userId}")
    public getPosts(@Param('userId') userId: number) {
        return this.postsService.findAll(userId);
    }

    @ApiOperation({
        summary: 'Creates a new post',
    })
    @ApiResponse({
        status: 201,
        description: 'Successfully created post',
    })
    @Post()
    public createPost(@Body() createPostDto: CreatePostDto) {
        console.log(createPostDto);

        return "Great success!";
    }
}