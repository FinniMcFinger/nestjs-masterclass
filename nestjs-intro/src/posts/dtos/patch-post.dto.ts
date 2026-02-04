import {CreatePostDto} from "./create-post.dto";
import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsInt, IsNotEmpty} from "class-validator";

export class PatchPostDto extends PartialType(CreatePostDto) {
    @ApiProperty({
        description: "The ID of the post to be updated",
        example: "1234",
    })
    @IsInt()
    @IsNotEmpty()
    id: number;
}