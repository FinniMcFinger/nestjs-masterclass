import {IsJSON, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePostMetaOptionsDto {
    @ApiProperty()
    @IsJSON()
    @IsNotEmpty()
    metaValue: string;
}