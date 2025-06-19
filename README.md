 
# Expense Tracker API

A RESTful API for managing personal expenses, with file uploads, email notifications, job queue support, and full documentation.

---

##  Requirements

- Node.js 16+
- PostgreSQL
- (Optional) Docker & Docker Compose

---

##  Setup Instructions

### 1. Install dependencies

```sh
npm install
npm install --save-dev sequelize-cli
npm install joi
```

### 2. Initialize Sequelize project

```sh
npx sequelize-cli init
```
This creates: `models/`, `migrations/`, `seeders/`, `config/config.json`

### 3. Generate Models & Migrations

```sh
npx sequelize-cli model:generate --name User --attributes email:string,name:string,password_hash:string
npx sequelize-cli model:generate --name Expense --attributes user_id:integer,amount:decimal,category:string,description:text,incurred_at:date
npx sequelize-cli model:generate --name ExpenseFile --attributes expense_id:integer,filename:string,file_url:string
npx sequelize-cli model:generate --name MonthlySummary --attributes user_id:integer,month:date,total_amount:decimal,category_data:json
```

### 4. Run Migrations

```sh
npx sequelize-cli db:migrate
```

### 5. Seed the Database (optional)

```sh
npx sequelize-cli seed:generate --name seed-users
npx sequelize-cli seed:generate --name seed-expenses
npx sequelize-cli db:seed:all
```

### 6. Undo Migrations or Seeds (optional)

```sh
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:seed:undo:all
```

---

##  Email & File Storage Configuration

- Edit your `.env` file:
  ```
  EMAIL_HOST=smtp.example.com
  EMAIL_USER=your@email.com
  EMAIL_PASS=yourpassword
  FILE_STORAGE_PATH=uploads/
  ```
- You can use local storage or cloud providers (e.g., AWS S3, Google Cloud Storage).

---

##  Running Tests & Coverage

```sh
npx jest --coverage
```

---

## 📬 API Documentation (Postman / OpenAPI)

- [Postman Collection](./docs/expense-tracker.postman_collection.json)
- [OpenAPI/Swagger Spec](./docs/openapi.yaml)

---

## 🐳 Docker Compose (optional)

```yaml
# docker-compose.yml
version: '3'
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

```sh
docker-compose up --build
```

---

## 📝 Dev Log

### Architecture Decisions
- Used Sequelize ORM for database management.
- JWT for authentication.
- Job queue for heavy/background tasks (e.g., email sending).
- Codebase split into Controllers, Services, Middlewares for maintainability.

### Tradeoffs
- Chose PostgreSQL for robust financial data handling.
- Started with local file storage; can upgrade to S3 later.
- No TypeScript for simplicity at MVP stage.

### Future Improvements
- OAuth login (Google/Facebook).
- GraphQL support.
- Redis caching for performance.
- Add rate limiting.
- CI/CD with GitHub Actions.

---

## 📎 Useful Links

- [GitHub Repository](https://github.com/ZayedShayaa/expense-tracker-api)

---

> For questions or contributions, open an issue