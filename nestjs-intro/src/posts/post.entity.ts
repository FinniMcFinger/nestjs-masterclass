/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PostType } from "./enums/post-type.enum";
import { PostStatus } from "./enums/post-status.enum";
import { CreatePostMetaOptionsDto } from "../meta-options/dtos/create-meta-options.dto";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 512,
        nullable: false,
    })
    title: string;

    @Column({
        type: "enum",
        enum: PostType,
        nullable: false,
        default: PostType.POST
    })
    postType: PostType;

    @Column({
        type: "varchar",
        length: 256,
        nullable: false,
        unique: true,
    })
    slug: string;

    @Column({
        type: "enum",
        enum: PostStatus,
        nullable: false,
        default: PostStatus.DRAFT,
    })
    status: PostStatus;

    @Column({
        type: "text",
        nullable: true,
    })
    content?: string;

    @Column({
        type: "text",
        nullable: true,
    })
    schema?: string;

    @Column({
        type: "varchar",
        length: 1024,
        nullable: true,
    })
    featuredImageUrl?: string;

    @Column({
        type: "timestamptz",
        nullable: true,
    })
    publishOn?: Date;

    tags?: string[];

    metaOptions?: CreatePostMetaOptionsDto;
}