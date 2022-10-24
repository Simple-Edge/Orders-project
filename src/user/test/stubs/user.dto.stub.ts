import { CreateUserDto } from "src/user/dto/create-user.dto";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { UpdateUserDto } from "src/user/dto/update-user.dto";


export function createUserDTOStub (email: string): CreateUserDto{
    return {
        name: "bart",
        lastName: "tar",
        email: email + '@gmail.com',
        password: "123",
    }

}

export function loginUserDTOStub (email:string): LoginUserDto{
    return{
        email: email,
        password: "123",
    }
    
}

export const incorrectLoginUserDTOStub: LoginUserDto = {
    email: "baratoohllkj@gmail.com",
    password: "1234",
}


export const createAnotherUserDTOStub: CreateUserDto = {
    name: "bart",
    lastName: "tar",
    email: "baratoohllkfj@gmail.com",
    password: "123",
}

export const updateUserDTOStub: UpdateUserDto = {
    name: "bart",
    lastName: "tart",
    email: "baratoohllkfj@gmail.com"
}