import { DynamicModule, Module } from '@nestjs/common'
import {
	LiquibaseConfig,
	Liquibase,
} from 'liquibase';
import { LiquibaseExecutor } from './liquibase.executor';

@Module({})
export class LiquibaseModule {
    static register(config: LiquibaseConfig): DynamicModule {
        return {
            module: LiquibaseModule,
            providers: [
                {
                    provide: 'LIQUIBASE_CONFIG',
                    useValue: config,
                },
                {
                    provide: LiquibaseExecutor,
                    useFactory: (config: LiquibaseConfig) => new LiquibaseExecutor(config),
                    inject: ['LIQUIBASE_CONFIG']
                },
            ],
            exports: [LiquibaseExecutor]
        }
    }
}