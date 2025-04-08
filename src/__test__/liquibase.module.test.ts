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
        const databasePort = 5432;

        // TestContainer
        const psql = await new GenericContainer("postgres") 
            .withExposedPorts(databasePort) // Using unused port.
            .withEnvironment({"POSTGRES_PASSWORD": "mypassword"})
            .withName("test-postgres")
            .withAutoRemove(true)
            .start();

        const host = psql.getHost();
        const port = psql.getMappedPort(databasePort)

        // Liquibase Config
        defaultConfig = { 
            allow: true,
            config: {
                searchPath: 'example/',
                changeLogFile: 'root.yaml',
                url: `jdbc:postgresql://localhost:${port}/postgres`,
                username: "postgres",
                password: "mypassword",
            }
        }

        // PostgreSQL Client
        client = new Client({
            host: host,
            port: port,
            user: "postgres",
            password: "mypassword",
            database: "postgres"
        })

        await client.connect();
    })

    beforeEach(async () => {
        const truncateQuery = `
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
          `
        await client.query(truncateQuery);
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