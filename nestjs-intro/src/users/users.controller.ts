import {Controller, Get, Post, Patch, Put, Delete, Param, Query, Body, Req, Headers, Ip, ParseIntPipe,
    DefaultValuePipe, ValidationPipe} from '@nestjs/common';
import {CreateUserDto} from "./dtos/create-user.dto";
import {GetUserParamsDto} from "./dtos/get-users-param-dto";
import {PatchUserDto} from "./dtos/patch-user.dto";
import {UsersService} from "./providers/users.service";
import {ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";

@Controller('users')
// API Tags seems to be unnecessary in more recent versions of Swagger, but it can override the default name if needed.
// @ApiTags('Users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // optional param declaration to get rid of hanging slash
    @Get('{/:id}')
    @ApiOperation({
        summary: "Retrieves user records",
    })
    @ApiResponse({
        status: 200,
        description: "Records successfully retrieved",
    })
    @ApiQuery({
        name: "limit",
        type: "number",
        required: false,
        description: "The max number of user entries retrieved",
        example: "100",
        default: "10"
    })
    @ApiQuery({
        name: "page",
        type: "number",
        required: false,
        description: "The page number of the user entries retrieved",
        example: "4",
        default: "1"
    })
    public getUsers(
        @Param() getUsersParamDto: GetUserParamsDto,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        return this.usersService.findAll(getUsersParamDto, limit, page);
    }

    @Post()
    // no `ValidationPipe` reference needed in @Body declaration because global pipe is being used
    public createUser(
        @Body() createUserDto: CreateUserDto,
    ) {
        console.log(`request body type CreateUserDto? ${createUserDto instanceof CreateUserDto}`)
        console.log(createUserDto);

        return "POST to /users";
    }

    @Patch()
    public patchUser(@Body() patchUserDto: PatchUserDto) {
        return patchUserDto;
    }
}
