import {Role} from './roles.model';

export interface User {
    user: string;
    role: Role;
}

export interface UserDB {
    role: Role;
}
