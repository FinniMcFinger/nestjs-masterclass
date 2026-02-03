import {Controller, Get, Post, Patch, Put, Delete, Param, Query, Body, Req, Headers, Ip, ParseIntPipe,
    DefaultValuePipe, ValidationPipe} from '@nestjs/common';
import {CreateUserDto} from "./dtos/create-user.dto";
import {GetUserParamsDto} from "./dtos/get-users-param-dto";
import {PatchUserDto} from "./dtos/patch-user.dto";
import {UsersService} from "./providers/users.service";
import {ApiTags} from "@nestjs/swagger";

@Controller('users')
// API Tags seems to be unnecessary in more recent versions of Swagger, but it can override the default name if needed.
// @ApiTags('Users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // optional param declaration to get rid of hanging slash
    @Get('{/:id}')
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
