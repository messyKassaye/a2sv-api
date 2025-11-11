# E-Commerce Backend API

This is a **NestJS backend** for an e-commerce platform. It provides user authentication, product management, order management, product image uploads, caching, and rate-limiting features.

---

## Table of Contents

- [Technologies](#technologies)  
- [Setup](#setup)  
- [Environment Variables](#environment-variables)  
- [Running the Project](#running-the-project)  
- [API Endpoints](#api-endpoints)  
- [Features](#features)  
- [Testing](#testing)  
- [Folder Structure](#folder-structure)  
- [Contact](#contact)

---

## Technologies

- NestJS  
- TypeScript  
- Prisma ORM  
- PostgreSQL (or your database)  
- Redis (for caching)  
- Swagger (API documentation)  

---



## Setup

1. Clone the repository:

```bash
git clone https://github.com/messyKassaye/a2sv-api
cd a2sv-api
```

## Environment Variables

Create a `.env` file in the root directory or rename `.env.example` into `.env`:

```env
NODE_ENV=development
BASE_URL=http://localhost:5000
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASS=123456789
DB_PORT=5432
DB_NAME=a2sv_assessment_db
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

ORIGINS=http://localhost:5173,http://localhost:3000
JWT_SECRET=de901d20f770b59f3a598bc53ef73c556c1a320f3be1397726c4713bd1de4bc5
JWT_EXPIRES_IN=15m

REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_TTL=60
```

2. Install dependencies:

```bash
npm install
```

3. Initialize Prisma:

```bash
npx prisma generate
npm run migrate
```

4. (Optional) Start Redis if using caching or use docker:

```bash
redis-server
```

---
## Run seeder to create ADMIN
### Use the following command to run the database seeder and create the ADMIN
```bash
npm run seed
```
---

## Running the Project

```bash
npm run start:dev
```

Swagger API documentation available at:  
```
http://localhost:5000/
```

---

## API Endpoints

### Authentication

- **POST /auth/register** – User register  
Example Request Body:

```json
{
  "username": "john123",
  "email": "john@example.com",
  "password": "Password@123"
}
```

- **POST /auth/login** – User login, returns JWT  
Example Request Body:

```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

---

### Products

- **GET /products** – List products with pagination & optional search  
- **GET /products/:id** – Get product details  
- **POST /products** – Create a product (Admin only)  
Example Request Body:

```json
{
  "name": "Laptop",
  "description": "Powerful gaming laptop",
  "price": 1200,
  "stock": 5,
  "category": "Electronics"
}
```

- **PUT /products/:id** – Update a product (Admin only)  
- **DELETE /products/:id** – Delete a product (Admin only)  
- **POST /products/:id/upload** – Upload product image (Admin only)  

---

### Orders

- **POST /orders** – Place a new order (Authenticated user)  
Example Request Body:

```json
[
  { "productId": "uuid-product-1", "quantity": 2 },
  { "productId": "uuid-product-2", "quantity": 1 }
]
```

- **GET /orders** – View order history (Authenticated user)  

---

## Features

### 1. Authentication

- Passwords are hashed using **bcrypt**  
- JWT-based authentication  
- Input validation for email, password, and username  

### 2. Product Management

- CRUD operations for products  
- Validation on fields (name, description, price, stock, category)  
- Admin-only endpoints for creating, updating, deleting products  
- Swagger documentation for API endpoints  

### 3. Product Image Uploads

- Upload single or multiple product images  
- Stored locally (`uploads/`) or on **Cloudinary**  
- Image URLs saved in database with base URL  
- Works on Windows and Linux  

### 4. Caching

- Redis used to cache product listings  
- Cache keys are based on page, limit, and search query  
- Cached responses returned if available  

### 5. Rate Limiting

- Prevent abuse and brute-force attacks  
- Configured with `@nestjs/throttler`  
- Global: 5 requests per minute per IP  
- Login endpoints: stricter limit (5 requests/min)  

### 6. Orders

- Place orders with multiple products  
- Stock verification and transaction handling (rollback on failure)  
- Total price calculated server-side  
- Order history restricted to authenticated user  

### 7. Testing

- Unit tests for services using mocked Prisma  
- Tests cover product creation, update, deletion, and orders  

---

## Running Tests

```bash
npm run test
```

## Notes

- Ensure `uploads/` folder exists for local image storage  
- Redis server must be running for caching  
- Swagger docs provide full schema and request/response examples  

---


