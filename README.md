<div align="center">
  <h2>liquibase-nestjs</h2>
  <p>A simple library for applying Liquibase in NestJS</p>
</div>

English | [한국어](docs/README_kr.md)

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Note](#note)


## Installation
```
npm install nestjs-liquibase
```

## Quick Start

**1. Create `Liquibase Changelog`**

The usage is described in the following structure. if you use a different structure, it should be applied as information in a different structure.
```
src/db/root.yaml
src/db/changelog/*.sql
```

See `/examples` for more information.

**2. Import `LiquibaseModule`**
```typescript
@Module({
    imports: [
        // ...
        LiquibaseModule.regsiter({
            allow: true,
            config: {
                ...
            }
        })
    ],
})
export class AppModule {}
```


- The `LiquibaseModule.register()` function requires a parameter of Type `LiquibaseDynamicConfig`.
- `config` is type of [LiquibaseConfig](https://github.com/liquibase/node-liquibase/blob/master/src/models/liquibase-config.model.ts) based on [liquibase](liquhttps://www.npmjs.com/package/liquibaseibase) library.


LiquibaseDynamicConfig Example
```ts
LiquibaseModule.register({
    allow: true,
    config: {
      searchPath: "dist/db",
      changeLogFile: "root.yaml",
      url: "jdbc:postgresql://localhost:5432/postgres",
      username: "postgres",
      password: "mypassword", 
    }
  })
```

- You can also add it using `LiquibaseModule.registerAsync()`

**3. Edit `nest-cli.json`**
When server build, edit `nest-cli.json` so that the Liquibase related files are can be copied to the build result. 

```json
...
"compilerOptions": {
    "assets" : [
      {
        "include" : "db/root.yaml",
        "outDir" : "dist"
      },
      {
        "include": "db/changelog/*",
        "outDir": "dist"
      }
    ],
}
...


```

When you build server, It will be copied to the build result as follows.

```
dist
  ㄴ db
    ㄴ root.yaml
    ㄴ changelog
      ㄴ create_member.sql 
```

**4. Run server**
```
npm run start
```
> Console Output

<img src="docs/image.png" width="250">

## Note
- Currently, LiquibaseModule run `update` command of Liquibase