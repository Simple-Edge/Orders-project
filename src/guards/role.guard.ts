import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { RoleInterface } from 'src/common/models/role.model';
import { UserInterface } from '../common/models/user.model';
import { ExpressRequestInterface } from '../common/interfaces/express-request.interface';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private roles: string[],
        ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<ExpressRequestInterface>();
        await request.user.populate('role') 
        const curUserRoles = request.user.role as unknown as RoleInterface
        for (let role of this.roles) {
            if(curUserRoles.permissions[role]){
                
                return true
            }  
        } 

        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }
}
