import { Module } from "@nestjs/common";
import { SchemasModule } from "../common/schemas/@schemas.module";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

@Module({
    imports: [SchemasModule],
    controllers: [RoleController],
    providers: [RoleService],
})
export class RoleModule{

}