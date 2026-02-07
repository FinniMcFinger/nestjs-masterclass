import { Injectable } from '@nestjs/common';
import {CreateMetaOptionsDto} from "../dtos/create-meta-options.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {MetaOption} from "../meta-option.entity";
import {Repository} from "typeorm";

@Injectable()
export class MetaOptionsService {
    constructor(
        @InjectRepository(MetaOption)
        private readonly metaOptionsRepository: Repository<MetaOption>,
    ) {}

    public async create(createMetaOptionsDto: CreateMetaOptionsDto) {
        console.log(`creating meta options record in database`);
        let newOption = this.metaOptionsRepository.create(createMetaOptionsDto);

        return await this.metaOptionsRepository.save(newOption);
    }
}
