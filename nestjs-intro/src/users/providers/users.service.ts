import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {GetUserParamsDto} from "../dtos/get-users-param-dto";
import {AuthService} from "../../auth/providers/auth.service";

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
     */
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) {}

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
    public findById(id: number) {
        return {
            id: id,
            firstName: "Marty",
            email: "marty@outtatime.com",
        }
    }
}