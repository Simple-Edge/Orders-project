import { UserInterface } from '../models/user.model';

export type UserType = Omit<UserInterface, 'hashPassword'>;
