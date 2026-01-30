import {Controller, Get, Post, Patch, Put, Delete, Param, Query, Body, Req, Headers, Ip} from '@nestjs/common';

@Controller('users')
export class UsersController {
    // optional param declaration to get rid of hanging slash
    @Get(':id{/:optional}')
    public getUsers(@Param() params: any, @Query() query: any) {
        console.log(params);
        console.log(query);

        return `GET to /users`;
    }

    // demonstrates grabbing specific fields
    // @Get(':id{/:optional}')
    // public getUsers(@Param('id') id: string, @Query('limit') limit: number) {
    //     console.log(id);
    //     console.log(limit);
    //
    //     return `GET to /users/${id}`;
    // }

    @Post()
    public createUser(@Req() request: Request, @Headers() headers: any, @Ip() ip: any) {
        console.log(request.body);
        console.log(headers);
        console.log(ip);

        return "POST to /users";
    }
}
