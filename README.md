<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A Simple To-Do Backend Application built with NestJS, featuring JWT authentication and Prisma ORM.</p>

## Description

This project implements a secure To-Do API with the following features:

- User authentication using JWT
- Session management
- CRUD operations for tasks
- Data isolation per user
- RESTful API endpoints
- Swagger documentation

## Prerequisites

- Node.js (>= 16.x)
- Bun (latest version)
- SQLite

## Project Setup

1. Clone the repository:

```bash
$ git clone https://github.com/nhuxhr/simple-to-do.git
$ cd simple-to-do
```

2. Install dependencies:

```bash
$ bun install
```

3. Copy environment variables:

```bash
$ cp .env.example .env
```

4. Configure your `.env` file with appropriate values:

```env
PORT=4000
DATABASE_URL="file:../.tmp/dev.db"
HOST_URL="http://localhost:4000"
REST_PATH="/api"
SWAGGER_ENABLED=true
SWAGGER_PATH="/docs"
JWT_SECRET="your-secret-key"
```

5. Run database migrations:

```bash
$ bunx prisma migrate dev
```

## Running the Application

```bash
# development
$ bun start

# watch mode
$ bun start:dev

# production mode
$ bun start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:4000/docs
```

### Available Endpoints

#### Auth

- POST `/api/v1/auth/signup` - Register a new user
- POST `/api/v1/auth/signin` - Login
- DELETE `/api/v1/auth/logout` - Logout
- GET `/api/v1/auth/whoami` - Get current user info
- PATCH `/api/v1/auth/password` - Change password

#### Sessions

- GET `/api/v1/sessions` - List active sessions
- GET `/api/v1/sessions/:id` - Get session details
- PATCH `/api/v1/sessions/:id/revoke` - Revoke session

#### Tasks

- POST `/api/v1/tasks` - Create task
- GET `/api/v1/tasks` - List tasks
- GET `/api/v1/tasks/:id` - Get task details
- PATCH `/api/v1/tasks/:id` - Update task
- DELETE `/api/v1/tasks/:id` - Delete task

## Testing

```bash
# unit tests
$ bun test

# e2e tests
$ bun test:e2e

# test coverage
$ bun test:cov
```

## Technical Stack

- **Framework**: NestJS
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Project Structure

```
src/
├── api/             # API endpoints
├── common/          # Shared utilities, guards, filters
├── domain/          # Business logic and entities
├── modules/         # Core modules (Prisma, JWT)
└── main.ts          # Application entry point
```

## Support

For questions and support, please create an issue in the repository.

## License

This project is MIT licensed.
