import { ModuleMetadata } from "@nestjs/common";
import { LiquibaseDynamicConfig } from "./liquibase.config";

export interface LiquibaseConfigAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => Promise<LiquibaseDynamicConfig> | LiquibaseDynamicConfig;
    inject?: any[],
}