import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {PostsModule} from "./posts/posts.module";
import {AuthModule} from './auth/auth.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/user.entity";
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import {SnakeNamingStrategy} from "typeorm-naming-strategies";

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
                // entities: [User],
                autoLoadEntities: true,
                namingStrategy: new SnakeNamingStrategy(),
                synchronize:  process.env.DB_SYNC === "true", // use in dev only
                host: process.env.DB_HOST,
                port: 5432,
                username: process.env.DB_USERNAME ?? "user",
                password: process.env.DB_PASSWORD ?? "pass",
                database: process.env.DB_DATABASE ?? "nestjs-masterclass",
            }),
        }),
        TagsModule,
        MetaOptionsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
