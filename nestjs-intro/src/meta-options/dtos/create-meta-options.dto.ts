import {IsJSON, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateMetaOptionsDto {
    @ApiProperty()
    @IsJSON()
    @IsNotEmpty()
    metaValue: string;
}