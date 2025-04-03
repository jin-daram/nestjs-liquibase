import { LiquibaseConfig } from "liquibase";

export type LiquibaseDynamicConfig = {
    allow?: boolean;
    config: LiquibaseConfig
}