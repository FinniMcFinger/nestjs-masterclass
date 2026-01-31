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

### Services and Providers

Services contain your main business logic. These are also called providers in the Nest framework.

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

Nest uses [class-validator](https://github.com/typestack/class-validator) in the background to do much validation within DTOs. This package contains a plethora of validation coverage, so when in doubt, refer to its documentation.

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
