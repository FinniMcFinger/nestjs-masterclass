import {Body, Controller, Get, Param, Patch, Post} from "@nestjs/common";
import {PostsService} from "./providers/posts.service";
import {CreatePostDto} from "./dtos/create-post.dto";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {PatchPostDto} from "./dtos/patch-post.dto";

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
        return this.postsService.create(createPostDto);
    }

    @ApiOperation({
        summary: 'Updates an existing post',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully updated post',
    })
    @Patch()
    public updatePost(@Body() patchPostDto: PatchPostDto) {
        console.log(patchPostDto);

        return patchPostDto;
    }
}