# API Fastify Drizzle RBAC 

API Full Typescript and OpenAapi  with Fastify, Drizzle and JWT auth + RBAC 

## Prerequisites
- Ensure you have the following installed in your machine:
  - Docker
  - pnpm
  - biome

### Features

- `TypeScript` for type safety and better development experience.

- `Fastify` for full typescript development integration.

- `Docker` for Development provides a Postgres database.

- `Vitest` for code reliability and correctness with a fast and efficient test runner.

- `Biome` Provides consistent code styling and linting, replacing ESLint and Prettier.

- `Scalar` for API Documentation automatically generates API documentation for better maintainability and usability.

- `Casl`: Implements a flexible role-based access control system for secure user permissions.


## Project Setup Guide


### Setup & Initialization

Copy the example environment file and update it with the necessary environment variables:

```bash
cp .env.exemple .env
```

You can run the container to start database localy
or if you prefer can or if you prefer, you can `connect to an external` by also filling in the DB's `credentials` on `ENV`

```bash
docker compose up -d
```

Generate the database schema and push to

```bash
pnpm db:push
```
You seed the DB with initial users.

```bash
pnpm db:seed
```

#### Access the development server:

```bash
http://localhost:${PORT}
```
#### Access the api docs:

```bash
http://localhost:${PORT}/docs
```

#### Access the database

Open the Drizzle Studio to interact with your database visually:
```bash
https://local.drizzle.studio
```

## Available Scripts

The following scripts are available in this project:

### Run Scripts
| CMD             | Script                      | Explanation                                                 |
| --------------- | --------------------------- | ----------------------------------------------------------- |
| `dev`           | `tsx watch src/server.ts`   | Starts the development server with hot-reloading using tsx. |
| `build`         | `tsup`                      | Bundles the application using tsup.                         |
| `start`         | `node dist/server.js`       | Runs the built application from the `dist` directory.       |

### Linting & Formatting Scripts
| CMD             | Script                      | Explanation                                                 |
| --------------- | --------------------------- | ----------------------------------------------------------- |
| `biome:format`  | `pnpm biome format --write` | Formats the codebase using Biome.                           |
| `biome:lint`    | `pnpm biome check --write`  | Lints the codebase using Biome.                             |
| `biome:check`   | `pnpm biome check --write`  | Checks the codebase for issues using Biome.                 |

### Database Scripts
| CMD             | Script                      | Explanation                                                 |
| --------------- | --------------------------- | ----------------------------------------------------------- |
| `db:studio`     | `pnpm drizzle-kit studio`   | Opens the Drizzle Studio for database management.           |
| `db:push`       | `pnpm drizzle-kit push`     | Pushes the current database schema to the database.         |
| `db:generate`   | `pnpm drizzle-kit generate` | Generates the database client based on the schema.          |
| `db:migrate`    | `tsx src/db/migrate.ts`     | Runs the database migrations.                               |
| `db:seed`       | `tsx src/db/seed.ts`        | Seeds the database with initial data.                       |
| `db:reset`      | `tsx src/db/reset.ts`       | Resets the database to its initial state.                   |

### Test Scripts
| CMD             | Script                      | Explanation                                                 |
| --------------- | --------------------------- | ----------------------------------------------------------- |
| `test`          | `vitest run`                | Runs the test suite using Vitest.                           |
| `test:watch`    | `vitest`                    | Runs the test suite in watch mode using Vitest.             |
| `test:ui`       | `vitest --ui`               | Runs the test suite with a UI using Vitest.                 |
| `test:coverage` | `vitest run --coverage`     | Runs the test suite and generates a coverage report using Vitest.   |

### Usage

To execute any of these scripts, run the following command in your terminal:

```sh
pnpm <script-name>
```

For example, to start the development server, run:

```sh
pnpm dev
```

### Biome Setup

To ensure consistency in formatting and linting, Biome is set as the default tool in this project.

- Install the Biome VS Code Extension for better integration.

.vscode Folder: `Do not remove the .vscode folder`, as it disables ESLint and Prettier while enforcing Biome as the default formatter.

### References

- Fastify Plugins https://fastify.dev/ecosystem/
- Fastify https://fastify.dev/
- tsup https://tsup.egoist.dev/
- tsx https://tsx.is/
- Cals https://casl.js.org/v6/en/
- Drizzle https://orm.drizzle.team/docs/kit-overview
- Zod https://zod.dev/
- readline-sync  https://github.com/anseki/readline-sync
- Micro UUID https://github.com/paralleldrive/cuid2
- Biome https://biomejs.dev/
- Vitest https://vitest.dev/
- Scalar https://scalar.com/
- Dotenv https://www.dotenv.org/
