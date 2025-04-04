import { Test } from "@nestjs/testing";
import { LiquibaseDynamicConfig } from "../type/liquibase.config";
import { LiquibaseModule } from "../module/liquibase.module";
import { Liquibase } from "liquibase";
import { NOT_APPLIED_STATUS_KEYWORD, SUCCESS_STATUS_KEYWORD } from "../constant/keyword.constant";
import { GenericContainer } from "testcontainers";
import { Client } from "pg";

describe("nestjs-liquibase", () => {
    let defaultConfig: LiquibaseDynamicConfig;
    let client: Client;

    beforeAll(async () => {
        const psql = await new GenericContainer("postgres")
            .withExposedPorts(5432) // Using unused port.
            .withEnvironment({"POSTGRES_PASSWORD": "mypassword"})
            .withName("test-postgres")
            .withAutoRemove(true)
            .start();

        defaultConfig = {
            allow: true,
            config: {
                searchPath: 'example/',
                changeLogFile: 'root.yaml',
                url: "jdbc:postgresql://localhost:5431/postgres",
                username: "postgres",
                password: "mypassword",
            }
        }

        client = new Client({
            host: "localhost",
            port: 5431,
            user: "postgres",
            password: "mypassword",
            database: "postgres"
        })

        await client.connect();
    })

    beforeEach(async () => {
        await client.query(`
            DO
            $$
            DECLARE
                table_name text;
            BEGIN
                FOR table_name IN
                    SELECT tablename
                    FROM pg_tables
                    WHERE schemaname = 'public'
                LOOP
                    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE;', table_name);
                END LOOP;
            END;
            $$;
          `);
        // TODO: testcontainer를 통해 postgreSQL 컨테이너 생성
        
    })

    afterAll(async () => {
        await client.end();
    })

    it("LiquibaseModule.register()를 통해 모듈을 등록하면 성공적으로 Changelog가 반영된다. ", async () => {
        const module = await Test.createTestingModule({
            imports: [LiquibaseModule.register(defaultConfig)],
        }).compile();

        const app = module.createNestApplication();
        await app.init();

        const testInstance = new Liquibase(defaultConfig.config);
        const result = await testInstance.status();
        expect(result.includes(NOT_APPLIED_STATUS_KEYWORD)).toBe(false)
        expect(result.includes(SUCCESS_STATUS_KEYWORD)).toBe(true)
    })

    it("LiquibaseModule.registerAsync()를 통해 모듈을 등록하면 성공적으로 Changelog가 반영된다. ", async () => {
        const module = await Test.createTestingModule({
            imports: [LiquibaseModule.registerAsync({
                useFactory: () => defaultConfig,
                inject: [],
            })]
        }).compile();

        const app = module.createNestApplication();
        await app.init();
        const testInstance = new Liquibase(defaultConfig.config);
        const result = await testInstance.status();
        expect(result.includes(NOT_APPLIED_STATUS_KEYWORD)).toBe(false)
        expect(result.includes(SUCCESS_STATUS_KEYWORD)).toBe(true)
    })

})