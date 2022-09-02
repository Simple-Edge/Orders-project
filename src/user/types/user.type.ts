import { UserInterface } from "../user.model";


export type UserType = Omit<UserInterface,'hashPassword'>;