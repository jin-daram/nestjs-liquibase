import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { Liquibase, LiquibaseConfig, POSTGRESQL_DEFAULT_CONFIG } from "liquibase";

@Injectable()
export class LiquibaseExecutor implements OnApplicationBootstrap {

    constructor(
        private readonly config: LiquibaseConfig
    ) {}

    async onApplicationBootstrap() {
        console.log("Loaded Liquibase Comfig.")
    
        const instance = new Liquibase(this.config);
        await instance.update({})
    }

}