import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common'
import { LiquibaseConfig } from 'liquibase';
import { LiquibaseExecutor } from './liquibase.executor';
import { LiquibaseDynamicConfig } from './liquibase.config';
import { LiquibaseAsyncExecutor } from './liquibase-async.executor';

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
            exports: [LiquibaseExecutor]
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
                LiquibaseAsyncExecutor
            ],
            exports: ['LIQUIBASE_CONFIG']
        };
    }
}

export interface LiquibaseConfigAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => Promise<LiquibaseDynamicConfig> | LiquibaseDynamicConfig;
    inject?: any[],
}

