/* eslint-disable prettier/prettier */
import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { PostType } from "./enums/post-type.enum";
import { PostStatus } from "./enums/post-status.enum";
import { CreateMetaOptionsDto } from "../meta-options/dtos/create-meta-options.dto";
import {MetaOption} from "../meta-options/meta-option.entity";
import {User} from "../users/user.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id?: number;

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

    @OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
        cascade: true,
        eager: true,
    })
    metaOptions?: MetaOption | null;

    @ManyToOne(() => User, (user) => user.posts, {})
    author: User | null;
}