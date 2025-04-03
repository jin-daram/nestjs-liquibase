import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { CommandHandler, Liquibase, Logger } from "liquibase";
import { LiquibaseDynamicConfig } from "./liquibase.config";

@Injectable()
export class LiquibaseExecutor implements OnApplicationBootstrap {

    constructor(
        private readonly config: LiquibaseDynamicConfig
    ) {}

    async onApplicationBootstrap() {
        const allow = this.config.allow;
        if (!allow) return;
        const instance = new Liquibase(this.config.config);
        await instance.update({})
        await instance.status()
    }

}