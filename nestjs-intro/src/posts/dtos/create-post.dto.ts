import {
    IsArray,
    IsEnum,
    IsISO8601,
    IsJSON,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    MinLength
} from "class-validator";
import {PostType} from "../enums/post-type.enum";
import {PostStatus} from "../enums/post-status.enum";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    title: string;

    @IsEnum(PostType)
    @IsNotEmpty()
    postType: PostType;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug should only have lower-case letters, numbers, and hyphens. For example: \"my-slug-here\""
    })
    slug: string;

    @IsEnum(PostStatus)
    @IsNotEmpty()
    status: PostStatus;

    @IsString()
    @IsOptional()
    content?: string;

    @IsJSON()
    @IsOptional()
    schema?: string;

    @IsUrl()
    @IsOptional()
    featuredImageUrl?: string;

    @IsISO8601()
    @IsOptional()
    publishOn?: Date;

    @IsArray()
    @IsString({ each: true })
    @MinLength(3, { each: true })
    @IsOptional()
    tags?: string[];

    metaOptions: [{ key: string, value: string }];
}
