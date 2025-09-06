# Global-Expansion-API

This project is a backend API for managing global expansion projects, matching clients with vendors based on project requirements and vendor capabilities.

## Setup

To set up and run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone git@github.com:JimmyAG/Global-Expansion-API-.git
    cd Global-Expansion-API-
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**

    Create a `.env` file in the root directory based on `.env.example` or `.env.docker.example` and fill in the required values.

    Or Just use these:

    `.env.docker`:

    ```bash
        NODE_ENV=docker
        # MySQL Configuration
        MYSQL_ROOT_PASSWORD=superSecretRootPassword
        MYSQL_DATABASE=mysqldb
        MYSQL_USER=expanders360_user
        MYSQL_PASSWORD=superSecretPassword
        MYSQL_LOCAL_PORT=3306

        # MongoDB Configuration
        MONGO_ROOT_USERNAME=admin
        MONGO_ROOT_PASSWORD=superSecretMongoPassword
        MONGO_DATABASE=mongodb
        MONGO_LOCAL_PORT=27017

        # Redis Configuration
        REDIS_HOST=redis
        REDIS_PORT=6379

        # JWT Configuration
        JWT_SECRET=aVeryLongAndRandomSecretKeyForJWTAuthenticationThatIsHighlySecureAndUnique
        JWT_EXPIRATION=360000s

        # Mail Configuration
        MAIL_HOST=mailhog
        MAIL_PORT=1025
        MAIL_SECURE=false

        # DB Connection
        DB_HOST=mysql-db
        DB_PORT=3306
    ```

    `.env`:

    ```bash
    NODE_ENV=development
    # MySQL Configuration

    MYSQL_ROOT_PASSWORD=superSecretRootPassword
    MYSQL_DATABASE=mysqldb
    MYSQL_USER=expanders360_user
    MYSQL_PASSWORD=superSecretPassword
    MYSQL_LOCAL_PORT=3306

    # MongoDB Configuration

    MONGO_ROOT_USERNAME=admin
    MONGO_ROOT_PASSWORD=superSecretMongoPassword
    MONGO_DATABASE=mongodb
    MONGO_LOCAL_PORT=27017

    JWT_SECRET=aVeryLongAndRandomSecretKeyForJWTAuthenticationThatIsHighlySecureAndUnique
    JWT_EXPIRATION=360000s

    MAIL_HOST=localhost
    MAIL_PORT=1025
    MAIL_SECURE=false
    ```

4.  **Docker:**

    You can run the entire app in Docker by running:

    ```bash
    docker compose up -d
    ```

    You then could skip step 5 part of running the migration and seeding

5.  **Database Setup (MySQL):**

    This project uses MySQL. Ensure you have a MySQL server running and configured according to your `.env` file.
    - **Run Migrations:**
      ```bash
      npm run typeorm:migration:run
      ```
    - **Seed Database (Optional):**
      ```bash
      npm run seed
      ```

6.  **Start the application:**

    Development server:

    ```bash
    npm run start:dev
    ```

7.  **Seeding:**

    In case you decided to go without the containerized nest app, you can seed different combination of data.
    You can view all the seed command by running:

    ```bash
    npm run seed:help
    ```

    by default the `seed.ts` generates 1000 clients, 500 vendors, one admin user:
    - username: `admin`.
    - email: `admin@expanders360.com`.
    - password: `adminpassword`. (creative, eh! :D)

    each client has up to 0 to 5 projects with services varying between vendors / clients. each project has random number of generated documents not more than 4.

    and you have an option to clear the database, which clears both (MySQL, MongoDB)

## Schema Diagrams

### User Entity

Represents a user in the system, either a client or an admin.

| Field           | Type      | Constraints                           | Description                    |
| :-------------- | :-------- | :------------------------------------ | :----------------------------- |
| `id`            | UUID      | Primary Key, Auto-generated           | Unique identifier for the user |
| `username`      | VARCHAR   | Unique, Max 255 chars                 | User's chosen username         |
| `password`      | VARCHAR   | Max 255 chars                         | Hashed password                |
| `role`          | ENUM      | `client`, `admin` (default: `client`) | Role of the user               |
| `company_name`  | VARCHAR   | Max 255 chars                         | Name of the user's company     |
| `contact_email` | VARCHAR   | Unique, Max 255 chars                 | User's contact email           |
| `created_at`    | TIMESTAMP | Auto-generated                        | Timestamp of creation          |
| `updated_at`    | TIMESTAMP | Auto-updated                          | Timestamp of last update       |

### Project Entity

Represents a project created by a client.

| Field             | Type      | Constraints                                            | Description                            |
| :---------------- | :-------- | :----------------------------------------------------- | :------------------------------------- |
| `id`              | UUID      | Primary Key, Auto-generated                            | Unique identifier for the project      |
| `user_id`         | UUID      | Foreign Key (references `users.id`)                    | ID of the user who created the project |
| `country`         | VARCHAR   | Max 255 chars                                          | Target country for the project         |
| `services_needed` | JSON      | Array of `Service` objects                             | Services required for the project      |
| `budget`          | DECIMAL   | Precision 10, Scale 2, Unsigned                        | Project budget                         |
| `status`          | ENUM      | `active`, `completed`, `cancelled` (default: `active`) | Current status of the project          |
| `created_at`      | TIMESTAMP | Auto-generated                                         | Timestamp of creation                  |
| `updated_at`      | TIMESTAMP | Auto-updated                                           | Timestamp of last update               |

### Vendor Entity

Represents a vendor offering services.

| Field                 | Type      | Constraints                                 | Description                                        |
| :-------------------- | :-------- | :------------------------------------------ | :------------------------------------------------- |
| `id`                  | UUID      | Primary Key, Auto-generated                 | Unique identifier for the vendor                   |
| `name`                | VARCHAR   | Unique, Max 255 chars                       | Name of the vendor                                 |
| `countries_supported` | JSON      | Array of strings, Nullable                  | Countries where the vendor operates                |
| `services_offered`    | JSON      | Array of `Service` objects, Nullable        | Services offered by the vendor                     |
| `rating`              | DECIMAL   | Precision 3, Scale 2, Default 0.0, Unsigned | Vendor's rating (e.g., 0.00 to 9.99)               |
| `response_sla_hours`  | INT       | Unsigned                                    | Service Level Agreement for response time in hours |
| `created_at`          | TIMESTAMP | Auto-generated                              | Timestamp of creation                              |
| `updated_at`          | TIMESTAMP | Auto-updated                                | Timestamp of last update                           |

### Match Entity

Represents a match between a project and a vendor.

| Field        | Type      | Constraints                            | Description                            |
| :----------- | :-------- | :------------------------------------- | :------------------------------------- |
| `id`         | UUID      | Primary Key, Auto-generated            | Unique identifier for the match        |
| `project_id` | UUID      | Foreign Key (references `projects.id`) | ID of the project                      |
| `vendor_id`  | UUID      | Foreign Key (references `vendors.id`)  | ID of the vendor                       |
| `score`      | DECIMAL   | Precision 5, Scale 2                   | Match score between project and vendor |
| `created_at` | TIMESTAMP | Auto-generated                         | Timestamp of creation                  |
| `updated_at` | TIMESTAMP | Auto-updated                           | Timestamp of last update               |

## API Docs

The API will be available at `http://localhost:3000` (or the port specified in your `.env` file). API documentation (Swagger UI) will be available at `/api`.

## API List

The API uses JWT for authentication. Endpoints requiring authentication will need a `Bearer` token in the `Authorization` header.

### Auth Module (`/auth`)

- **`POST /auth/login`**
  - **Description:** User login.
  - **Request Body:** `SignInDto` (email, password)
  - **Response:** JWT token

- **`POST /auth/signup`**
  - **Description:** User registration.
  - **Request Body:** `SignUpDto` (username, email, password)
  - **Response:** User details and JWT token

### Projects Module (`/projects`)

- **`GET /projects`**
  - **Description:** Retrieve all projects for the authenticated client.
  - **Roles:** `CLIENT`
  - **Response:** Array of `Project` objects

- **`GET /projects/:id/matches`**
  - **Description:** Retrieve matches for a specific project.
  - **Roles:** `CLIENT`
  - **Parameters:** `id` (project UUID)
  - **Response:** Array of `Match` objects

- **`GET /projects/:id/matches/rebuild`**
  - **Description:** Rebuild matches for a specific project.
  - **Roles:** `CLIENT`
  - **Parameters:** `id` (project UUID)
  - **Response:** `{ message: 'Matches rebuilt successfully' }`

- **`POST /projects/new`**
  - **Description:** Create a new project.
  - **Roles:** `CLIENT`
  - **Request Body:** `CreateProjectDto` (country, services_needed, budget)
  - **Response:** Newly created `Project` object

- **`PUT /projects/:id`**
  - **Description:** Update an existing project.
  - **Roles:** `CLIENT`
  - **Parameters:** `id` (project UUID)
  - **Request Body:** `UpdateProjectDto` (country, services_needed, budget, status)
  - **Response:** Updated `Project` object

- **`DELETE /projects/:id`**
  - **Description:** Delete a project.
  - **Roles:** `CLIENT`
  - **Parameters:** `id` (project UUID)
  - **Response:** `{ message: 'Project deleted successfully' }`

### Vendors Module (`/vendors`)

- **`GET /vendors`**
  - **Description:** Retrieve all vendors.
  - **Roles:** `ADMIN`
  - **Response:** Array of `Vendor` objects

- **`GET /vendors/:id`**
  - **Description:** Retrieve a specific vendor by ID.
  - **Roles:** `ADMIN`
  - **Parameters:** `id` (vendor UUID)
  - **Response:** `Vendor` object

- **`POST /vendors/new`**
  - **Description:** Create a new vendor.
  - **Roles:** `ADMIN`
  - **Request Body:** `CreateVendorDto` (name, countries_supported, services_offered, rating, response_sla_hours)
  - **Response:** Newly created `Vendor` object

- **`PUT /vendors/:id`**
  - **Description:** Update an existing vendor.
  - **Roles:** `ADMIN`
  - **Parameters:** `id` (vendor UUID)
  - **Request Body:** `UpdateVendorDto` (name, countries_supported, services_offered, rating, response_sla_hours)
  - **Response:** Updated `Vendor` object

- **`DELETE /vendors/:id`**
  - **Description:** Delete a vendor.
  - **Roles:** `ADMIN`
  - **Parameters:** `id` (vendor UUID)
  - **Response:** `{ message: 'Vendor deleted successfully' }`

### Analytics Module (`/analytics`)

- **`GET /analytics/top-vendors`**
  - **Description:** Retrieve top vendors per country.
  - **Roles:** `ADMIN`
  - **Response:** Array of top vendors data

### Research Documents Module (`/research-documents`)

- **`POST /research-documents`**
  - **Description:** Create a new research document.
  - **Roles:** `CLIENT`
  - **Request Body:** `CreateResearchDocumentDto`
  - **Response:** Created research document

- **`GET /research-documents/search`**
  - **Description:** Search for research documents.
  - **Roles:** `CLIENT`
  - **Query Parameters:** `ResearchDocumentQueryDto`
  - **Response:** Array of matching research documents

## Mailing Service

The `docker-compose.yml` file contains a local mailing service called `mailhog` running on port: `8025` where you will have and inbox and receive all mail sent by the nest app

## Matching Formula

The matching score between a project and a vendor is calculated using a MySQL stored procedure `insert_matches_for_project` which in turn uses a function `calculate_match_score`.

The `insert_matches_for_project` procedure identifies potential matches based on:

1.  **Country Support:** Vendor must support the project's country.
2.  **Service Match:** There must be at least one overlapping service between `project.services_needed` and `vendor.services_offered`.

The `calculate_match_score` function (defined in `database/migrations/1757027111836-CreateScoreCalculationFunction.ts`) takes into account:

- `COUNT(*)`: Number of matching services.
- `v.rating`: Vendor's rating.
- `v.response_sla_hours`: Vendor's response SLA in hours.

The exact formula for `calculate_match_score` is:

```

services_overlap \* 2 + rating + SLA_weight

```

The `insert_matches_for_project` procedure then inserts or updates these matches in the `matches` table.

## Notes

These are the vague points that I had to either find a workaround for / ditch entirely, and some considerations.

1. `SLA_weight`: wasn't clear so I had to come up with condition to figure it out.
2. `Flagging vendors`: also isn't clear, how is that helpful in the context of the task, I'm not sure! because we aren't updating anything related to whether a vendor can be matched after expiring what happens then and what do we calculate the expiry date against!
