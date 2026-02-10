import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {GetUserParamsDto} from "../dtos/get-users-param-dto";
import {AuthService} from "../../auth/providers/auth.service";
import {User} from "../user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateUserDto} from "../dtos/create-user.dto";


/**
 * Class to connect to Users table and perform business logic.
 * @class
 */
@Injectable()
export class UsersService {
    /**
     * Creates a new instance of `UsersService`
     * @constructor
     * @param authService
     * @param usersRepository
     */
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    public async createUser(createUserDto: CreateUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: {
                email: createUserDto.email,
            }
        })

        if (!existingUser) {
            let newUser = this.usersRepository.create(createUserDto);
            newUser = await this.usersRepository.save(newUser);

            return newUser;
        }
    }

    /**
     * Retrieves all users from database.
     * @param getUserParamDto
     * @param limit
     * @param page
     */
    public findAll(getUserParamDto: GetUserParamsDto, limit: number, page: number) {
        const isAuthenticated = this.authService.isAuthenticated();
        console.log(isAuthenticated);

        return [
            {
                id: 1,
                firstName: "Marty",
                email: "marty@outtatime.com",
            },
            {
                id: 2,
                firstName: "Emmett",
                email: "doc@outtatime.com",
            }
        ]
    }

    /**
     * Finds a single user by the ID.
     * @param id
     */
    public async findById(id: number) {
        return await this.usersRepository.findOneBy({ id });
    }
}