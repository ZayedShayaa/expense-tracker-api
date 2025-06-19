# Expense Tracker API

A RESTful API for managing personal expenses, with file uploads, email notifications, job queue support, and full documentation.

---

## Requirements

- Node.js 16+
- PostgreSQL
- (Optional) Docker & Docker Compose

---

## Setup Instructions

### 1. Install dependencies

```bash
npm install
npm install --save-dev sequelize-cli
npm install joi
```

### 2. Initialize Sequelize project

```bash
npx sequelize-cli init
```

Creates: `models/`, `migrations/`, `seeders/`, `config/config.json`

### 3. Generate Models & Migrations

```bash
npx sequelize-cli model:generate --name User --attributes email:string,name:string,password_hash:string
npx sequelize-cli model:generate --name Expense --attributes user_id:integer,amount:decimal,category:string,description:text,incurred_at:date
npx sequelize-cli model:generate --name ExpenseFile --attributes expense_id:integer,filename:string,file_url:string
npx sequelize-cli model:generate --name MonthlySummary --attributes user_id:integer,month:date,total_amount:decimal,category_data:json
```

### 4. Run Migrations

```bash
npx sequelize-cli db:migrate
```

### 5. Seed the Database (optional)

```bash
npx sequelize-cli seed:generate --name seed-users
npx sequelize-cli seed:generate --name seed-expenses
npx sequelize-cli db:seed:all
```

### 6. Undo Migrations or Seeds (optional)

```bash
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:seed:undo:all
```

---

## Job Queue Setup

We use **Bull** + **Redis** for background processing (e.g., file processing, email sending).

### Run queue processor independently:

```bash
node services/queue_service.js
```

---

## File Storage & Email Configuration

### File Uploads

- Uses `multer` for handling file uploads.
- Files are stored in `./uploads` directory.

### Email (SMTP)

- Uses `nodemailer` with Mailtrap for development.

### Environment Variables (.env):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=postgres
DB_PASSWORD=chatapp

JWT_SECRET=aVeryStrongAndLongRandomStringForJWTAndSessionSecret
JWT_EXPIRES_IN=30d
SALT_ROUNDS=10
NODE_ENV=development

FILE_UPLOAD_PATH=./uploads
MAX_FILE_UPLOAD=5

ANALYTICS_DEFAULT_RANGE_DAYS=365

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=f7e68a48494d1b
SMTP_PASS=478e9ea62c5fc0
SMTP_FROM=expensetrackerapp.com
```

---

## Running Tests & Coverage

### Run all tests:

```bash
npx jest
```

### Run tests with coverage:

```bash
npx jest --coverage
```

### Run single test file:

```bash
npx jest tests/expenses.test.js
```

---

## API Documentation (Postman / Thunder Client)

Use the following endpoints with `Bearer <token>` in the `Authorization` header.

### Authentication

- **Register**
  `POST http://localhost:3000/auth/register`

  ```json
  {
    "name": "Zayed",
    "email": "zayed1@example.com",
    "password": "123456789"
  }
  ```

- **Login**
  `POST http://localhost:3000/auth/login`

  ```json
  {
    "email": "zayed1@example.com",
    "password": "123456789"
  }
  ```

### Expenses

- **Create Expense**: `POST /api/expenses`
- **Get All Expenses**: `GET /api/expenses`
- **Get Single Expense**: `GET /api/expenses/:id`
- **Update Expense**: `PATCH /api/expenses/:id`
- **Delete Expense**: `DELETE /api/expenses/:id`

### 📎 File Uploads

- **Upload**: `POST /api/expenses/:id/files`
- **Download**: `GET /api/expenses/:expenseId/files/:fileId`

### Analytics

- **Monthly Summary**: `GET /api/analytics/monthly`
- **Category Breakdown**: `GET /api/analytics/categories?from=2025-06-01&to=2025-06-30`

### Export CSV (Download or Send via Email)

- **Send via Email**:

  ```
  GET /api/export/csv?from=2025-01-01&to=2025-06-18&email=test@mailtrap.io
  ```

- **Download**:

  ```
  GET /api/export/csv?from=2025-01-01&to=2025-06-18
  ```

---

## Docker Compose (optional)

```yaml
version: "3"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: expense_tracker
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
  api:
    build: .
    environment:
      DB_NAME: expense_tracker
      DB_USER: postgres
      DB_PASS: password
      DB_HOST: db
      DB_PORT: 5432
    ports:
      - "3000:3000"
    depends_on:
      - db
volumes:
  db_data:
```

Run with:

```bash
docker-compose up --build
```

---

## Dev Log

### Architecture Decisions

- Used Sequelize ORM for PostgreSQL
- Express.js for REST API
- JWT-based authentication
- Bull + Redis for background jobs (file/email)
- Directory structure organized by domain (controllers, services, jobs, routes, etc)

### Tradeoffs

- No TypeScript for simplicity
- Local file storage initially (easy upgrade to S3)

### Future Improvements

- OAuth login with Google
- GraphQL support
- Redis caching
- Add rate limiting
- CI/CD with GitHub Actions

---

## 📎 Useful Links

- [GitHub Repository](https://github.com/ZayedShayaa/expense-tracker-api)

For issues or contributions, feel free to open a pull request or issue.
