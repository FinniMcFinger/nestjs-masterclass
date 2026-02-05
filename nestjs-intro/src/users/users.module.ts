import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import {UsersService} from "./providers/users.service";
import {AuthModule} from "../auth/auth.module";
import {User} from "./user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
      forwardRef(() => AuthModule),
      TypeOrmModule.forFeature([User]),
  ]
})
export class UsersModule {}
