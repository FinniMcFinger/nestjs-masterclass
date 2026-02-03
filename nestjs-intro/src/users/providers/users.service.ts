import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {GetUserParamsDto} from "../dtos/get-users-param-dto";
import {AuthService} from "../../auth/providers/auth.service";

@Injectable()
export class UsersService {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) {}

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

    public findById(id: number) {
        return {
            id: id,
            firstName: "Marty",
            email: "marty@outtatime.com",
        }
    }
}