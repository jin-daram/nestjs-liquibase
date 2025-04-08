import { Inject, Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { CommandHandler, Liquibase, Logger } from "liquibase";
import { LiquibaseDynamicConfig } from "../type/liquibase.config";
import { NOT_APPLIED_STATUS_KEYWORD } from "../constant/keyword.constant";

@Injectable()
export class LiquibaseExecutor {

    constructor(
        @Inject('LIQUIBASE_CONFIG') private readonly config: LiquibaseDynamicConfig
    ) {}

    // async onApplicationBootstrap() {
    //     const allow = this.config.allow;
    //     if (!allow) return;
    //     const instance = new Liquibase(this.config.config);
    //     const result = await instance.status()
    //     if (result.includes(NOT_APPLIED_STATUS_KEYWORD)) {
    //         console.log("There are changes that have not been applied yet.")
    //         await instance.update({})
    //     }
    // }

    async runMigration() {
        const allow = this.config.allow;
        if (!allow) return;
        const instance = new Liquibase(this.config.config);
        const result = await instance.status()
        if (result.includes(NOT_APPLIED_STATUS_KEYWORD)) {
            console.log("There are changes that have not been applied yet.")
            await instance.update({})
        }
    }

}