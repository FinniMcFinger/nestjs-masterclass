import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator";

export class CreateTagDto {
    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(256)
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @MaxLength(256)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug should only have lower-case letters, numbers, and hyphens. For example: \"my-slug-here\"",
    })
    @IsNotEmpty()
    slug: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsJSON()
    @IsOptional()
    schema?: string;

    @ApiPropertyOptional()
    @IsUrl()
    @MaxLength(1024)
    @IsOptional()
    featuredImageUrl?: string;
}