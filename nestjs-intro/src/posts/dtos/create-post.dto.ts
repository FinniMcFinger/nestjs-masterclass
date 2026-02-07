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
    MaxLength,
    MinLength,
    ValidateNested
} from "class-validator";
import {PostType} from "../enums/post-type.enum";
import {PostStatus} from "../enums/post-status.enum";
import {CreateMetaOptionsDto} from "../../meta-options/dtos/create-meta-options.dto";
import {Type} from "class-transformer";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({
        description: "Title for the post",
        example: "Example Title",
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(512)
    title: string;

    @ApiProperty({
        enum: PostType,
        description: `Type of post, valid values: ${Object.values(PostType).join(", ")}`,
        example: PostType.POST
    })
    @IsEnum(PostType)
    @IsNotEmpty()
    postType: PostType;

    @ApiProperty({
        description: "The trailing URL slug for the post, for example 'my-post' in http://localhost:3000/posts/my-post",
        example: "my-post",
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug should only have lower-case letters, numbers, and hyphens. For example: \"my-slug-here\"",
    })
    @MaxLength(256)
    slug: string;

    @ApiProperty({
        enum: PostStatus,
        description: `Status of the post, valid values: ${Object.values(PostStatus)}`,
        example: PostStatus.DRAFT,
    })
    @IsEnum(PostStatus)
    @IsNotEmpty()
    status: PostStatus;

    @ApiPropertyOptional({
        description: "Content for the post",
        example: "Lorem ipsum dolor sit amit.",
    })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiPropertyOptional({
        description: "Serialize the JSON object or else validation error will result",
        example: "{\"@context\":\"https:\/\/schema.org\",\"@type\":\"Person\"}"
    })
    @IsJSON()
    @IsOptional()
    schema?: string;

    @ApiPropertyOptional({
        description: "URL for the post's featured image",
        example: "https://outtatime.com/images/delorean.png",
    })
    @IsUrl()
    @MaxLength(1024)
    @IsOptional()
    featuredImageUrl?: string;

    @ApiPropertyOptional({
        description: "The date and time at which the post was published",
        example: "2025-10-31T00:00:00+0000",
    })
    @IsISO8601()
    @IsOptional()
    publishOn?: Date;

    @ApiPropertyOptional({
        description: "An array of tag strings to use with this post",
        example: "[ \"new post\", \"first entry\" ]",
    })
    @IsArray()
    @IsString({ each: true })
    @MinLength(3, { each: true })
    @MaxLength(256, { each: true })
    @IsOptional()
    tags?: string[];

    @ApiPropertyOptional({
        type: "object",
        properties: {
            metaValue: {
                type: "string",
                description: "The JSON containing meta options",
                example: "{ \"sidebarEnabled\": true }",
            },
        }
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateMetaOptionsDto)
    metaOptions?: CreateMetaOptionsDto | null;
}
