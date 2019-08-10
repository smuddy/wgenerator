import {Role} from './roles.model';

export const RoleDefinitions = [
    {role: Role.reader, when: [Role.admin, Role.writer, Role.reader]},
    {role: Role.writer, when: [Role.admin, Role.writer]},
    {role: Role.admin, when: [Role.admin]},
];
