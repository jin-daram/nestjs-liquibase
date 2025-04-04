import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common'
import { LiquibaseExecutor } from '../executor/liquibase.executor';
import { LiquibaseDynamicConfig } from '../type/liquibase.config';
import { LiquibaseConfigAsyncOptions } from '../type/liquibase-config-async-options';

@Module({})
export class LiquibaseModule {
    static register(config: LiquibaseDynamicConfig): DynamicModule {
        return {
            module: LiquibaseModule,
            providers: [
                {
                    provide: 'LIQUIBASE_CONFIG',
                    useValue: config,
                },
                {
                    provide: LiquibaseExecutor,
                    useFactory: (config: LiquibaseDynamicConfig) => new LiquibaseExecutor(config),
                    inject: ['LIQUIBASE_CONFIG']
                },
            ],
            exports: ['LIQUIBASE_CONFIG']
        }
    }

    static registerAsync(options: LiquibaseConfigAsyncOptions): DynamicModule {
        return {
            module: LiquibaseModule,
            imports: options.imports || [],
            providers: [
                {
                    provide: 'LIQUIBASE_CONFIG',
                    useFactory: options.useFactory!,
                    inject: options.inject || [],
                },
                LiquibaseExecutor,
            ],
            exports: ['LIQUIBASE_CONFIG']
        };
    }
}