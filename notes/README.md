# NestJS Training Notes

## Nest CLI

You can install the Nest CLI with NPM via `npm install -g @nestjs/cli`. `nest --version` can be used to verify installation. It is recommended to install this globally, as it is not part of an individual project. The CLI provides you with many commands to generate projects, apps, modules, etc. When in doubt, use `nest --help`.

## Modules

Modules are packages of specific functionality. The `*.module.ts` is what connects all the module files.

```
users-module/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
├── user.entity.ts
└── users.controller.spec.ts
```

All interactions with that module go through the `*.module.ts` file (this is a naming convention; the `@Module` decorator is what actually creates a module). Nest connects all modules via `app.module.ts`. The `app` module is the central module for your application.

The `main.ts` file operates the entire application. It bootstraps the application, typically creating the `AppModule` which then calls your other modules. `main.ts` is the main entrypoint, similar to the application class file in Spring Boot for Java.

### Module Creation

A module can be created using the Nest CLI: `nest generate module module-name` or `nest g mo module-name`. It will create the module skeleton automatically and inject it into the `app-module.ts` imports. If the `app` module is in a subdirectory of `src`, you may have to add the import manually.

### Controllers

Controllers specify routing within the module and forward requests to service classes. They handle the incoming requests and decide which service classes and methods to invoke.

Nest is replete with decorators for building controllers. A controller is first defined with the `@Controller` decoration. There are decorators for each of the HTTP verbs as well as decorators for things like the request, request body, header, IP address. 

The `@Controller` and the HTTP verb decorators can be qualified with paths. For example `@Controllers('users')` would host the controller at `/users`. An endpoint within that controller decorated with `@Get(':id)` would be hosted at `/users/some-id-here`.

Optional path parameters can also be defined, but there are different implementation based on Nest version. Prior to v11, optional params were declared using the `?` character, i.e. `@Get(:optionalParam?)`. Version 11 integrates Express v5 which is not compatible with this declaration style (use of regexes). Thus, the format changed: `@Get({:optional-param})`. This can also be used to remove slashes in complex paths: `@Get(:id{/:optional)`. This makes both of the following valid endpoints to call: `/some-id/some-optional-value` and `/some-id`.

See the many controller files within the repository for examples of mechanics at work with other decorators. Most of them are very self-explanatory.

### Providers

Providers are services that contain your main business logic. Providers provide functionality _within_ the module. To make this functionality available to other modules, it has to be exported by the module. Providers are typified by the `@Injectable()` decoration. The provider is declared in the module's providers, and it is injected into anything using it via constructor.

### Specs

Spec files contain test files.

## Request and Response Lifecycle

```
request -> middleware -|-> filters start -> guards -> interceptors -> pipes -> controller 
                       |
                       -- filter boundary --
                                           |
controller -> interceptors -> filters end -|-> response
```

### Pipes

Pipes perform 2 major functions: validation and transformation of incoming requests. Pipes ensure that controllers receive information in the exact format that they require, otherwise they throw an error. Nest provides [9 different built-in pipes](https://docs.nestjs.com/pipes#built-in-pipes) that can be used out of the box without configuration. You can also create custom pipes containing validation logic as needed. Using the built-in pipelines doesn't work on optional parameters. Pipes that start with the `Parse` keyword do not need a new instance. Pipes like the `DefaultValuePipe` require a new instance along with other data (the default value in this case).

Pipes can be used globally by adding them to the app that in `main.ts`.

#### Validation Pipe

`ValidationPipe` can carry with it additional configurations. For example, if configuring `whitelist` to be `true`, superfluous data fields passed in request bodies will be ignored. See the [documentation](https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe) for all the configuration options.

Using `ValidationPipe` globally will ensure that all requests pass through some sort of validation if they handle a DTO.

### DTOs

Data transfer objects (DTOs) are useful for validating and treating data before it gets to the controller. DTOs keep the controller class from being crowded with validation and pipe calls.

Nest uses [class-validator](https://github.com/typestack/class-validator) in the background to do much validation within DTOs. This package contains a plethora of validation coverage, so when in doubt, refer to its documentation. Nested DTOs can also be validated in this manner, though you do need to leverage the `@Type` decorator from `class-transformer`. You can see this in action in the [post creation DTO](../nestjs-intro/src/posts/dtos/create-post.dto.ts) on the `metaOptions` field.

DTOs work hand-in-hand with the `ValidationPipe` provided by Nest. This is largely done with the metadata reflection API behind the scenes.

```typescript
import { Controller, Post, Body, ValidationPipe } from "@nestjs/common";

@Controller()
export class MyController {
    @Post()
    public create(
        @Body(new ValidationPipe()) body: MyTypeDto
    ) {
        // ...
    }
}
```

By default, request bodies _are not_ instances of the declared DTO, despite the type reference to it. They are objects with the same shape of the declared DTO type. In order to transform the request body into an instance of the declared DTO, you must configure the validation pipe with `transform: true`.

Using the [Mapped Types \(`@nestjs/mapped-types`\)](https://docs.nestjs.com/openapi/mapped-types) module allows you to prevent much code duplication, particularly by extending the `PartialType` class. You can see an example of this in action via the [`PatchUserDto` class](../nestjs-intro/src/users/dtos/patch-user.dto.ts).

## Dependency Injection

Intramodule dependency injection (DI) is easily done by declaring providers within the module file and injecting the dependency via constructors. 

Intermodule DI is done via the `exports` array in the `@Module` declaration. Only classes decorated as `@Injectable` can be exported. The module exporting the provider is then imported in the module declaration of the other module. You always import a module, not individual providers. Nest only imports the exported providers under the hood.

Circular dependencies are when two modules depend upon each other. They require special handling. Both modules must export the required providers. Both modules must import the other module. Leaving it here will generate a circular dependency error. The imports and injection points must all be wrapped in the `forwardRef` function provided by Nest (`@nestjs/common`). You can see this in play in the [users module](../nestjs-intro/src/users) and [auth module](../nestjs-intro/src/auth). You can see the injected `forwardRef` in the [users service](../nestjs-intro/src/users/providers/users.service.ts) and [auth service](../nestjs-intro/src/auth/providers/auth.service.ts).

## Code Documentation

Nest provides two types of tools for API documentation and code documentation.

### API Documentation

Nest comes with Swagger implementations for API documentation. It hosts the documentation at the same URL as your application, under the configured location, i.e. `/api`. Swagger is often configured in [`main.ts`](../nestjs-intro/src/main.ts). You can also add additional details to the Swagger docs via decorators in controllers and/or DTOs. See the [posts module](../nestjs-intro/src/posts) for many examples of documenting endpoints, DTOs, nested DTOs, mapped types, etc.

### Code Documentation

Compodoc is used to build generate code documentation. Nest does the heavy lifting for generating this documentation. This documentation is generated within the app, giving access to developers without publicly posting it. Compodoc can be configured in the [package.json](../nestjs-intro/package.json) to run in its own script to generate documents. It's a good idea to ignore these documents in source control, as they are meant to be generated on-demand. You _may_ want to add a version of the documentation to source control at set versions of the application. In this case, you would want to create a separate script that is explicitly called, possibly in a CI workflow.

Document coverage percentages are based on JSDoc comments within the code. Compodoc will automatically document your code without any sort of additional comments.

## Database Integration

### Object Relational Model

Nest has two tight integrations with object relational models (ORM): TypeORM and mongoose. TypeORM works with just about any relational database. Mongoose is aimed at NoSQL integrations, particularly MongoDB.  Other ORMs are also available. The ORM provides an abstraction layer in front of the database such that the developer won't need to write any queries for the database except in the most extreme circumstances.

### Relations

Mapping relations is easy via TypeORM. It contains many decorators for declaring all types of entity relations within the database. A key decorator is `@JoinColumn`. This column must be used to establish a foreign key in the entity in which the `@JoinColumn` is declared. For example, consider a one-to-one relation between a `user` entity and a `profile` entity. In order for the `user` entity to have a `profileId` column in the database, the `@JoinColumn` decorator must be applied to the field that holds the relation. For example:

```typescript
@Entity()
export class User {
    // any number of other column definitions
    
    // Default join column name is set to `profileId`, but you can set any name using the `name` field in a 
    // configuration object passed to the `@JoinColumn` declaration.
    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile;
}
```

#### Relation Options

- `cascade`: allows you to affect child records during interactions with the parent record, i.e. delete child records upon deletion of the parent
- `eager`: allows you to load child records when retrieving the parent record, i.e. `user -|---< post` setting `eager` to `true` would retrieve all the user's posts when retrieving the user and/or retrieve the user data when retrieving a post (this can be affected via the `relations` configuration when querying with TypeORM)
