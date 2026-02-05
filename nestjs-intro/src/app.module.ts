import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from "./posts/posts.module";
import { AuthModule } from './auth/auth.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {AuthService} from "./auth/providers/auth.service";

@Module({
    imports: [
        ConfigModule.forRoot({}),
        UsersModule,
        PostsModule,
        AuthModule,
        TypeOrmModule.forRootAsync({
            imports: [],
            inject: [],
            useFactory: () => ({
                type: "postgres",
                entities: [],
                synchronize:  process.env.DB_SYNC === "true", // use in dev only
                host: process.env.DB_HOST,
                port: 5432,
                username: process.env.DB_USERNAME ?? "user",
                password: process.env.DB_PASSWORD ?? "pass",
                database: process.env.DB_DATABASE ?? "nestjs-masterclass",
            }),
        })
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
