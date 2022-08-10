# Storefront API

An API to manage a store's operations using PostgreSQL database.

---

## Get Started

**Database Port**: 5432
**Server Port**: 3000

To get started running and testing this project apply the following steps:

1. Create two databases called '**storefront**' and '**storefront_test**'.
2. Run `npm install` to install all dependencies and devDependencies in the `package.json` file.
3. Run `npm i -g db-migrate` to install `db-migrate` package globally.
4. Run `db-migrate up` to create the database tables.
5. Create a `.env` file and fill it with the environment variables in Appendix section.
6. Run `npm run test` to run all jasmine tests.
7. Run `npm run start` to start the server.

---

## Database Structure

The API has exactly two different databases:

-   **storefront**: Main database for development.
-   **storefront_test**: Secondary database for testing.

<br>

Each database has four tables:

-   **users**
-   **orders**
-   **products**
-   **order_product**

<br>

The **users** table schema is as follows:

-   **id**: SERIAL PRIMARY KEY
-   **first_name**: VARCHAR(50)
-   **second_name**: VARCHAR(50)
-   **password**: VARCHAR(100)
-   **authority**: VARCHAR(50)

<br>

The **orders** table schema is as follows:

-   **id**: SERIAL PRIMARY KEY
-   **user_id**: integer REFERENCES users(id)
-   **complete**: boolean

<br>

The **products** table schema is as follows:

-   **id**: SERIAL PRIMARY KEY
-   **name**: VARCHAR(50)
-   **price**: integer
-   **category**: VARCHAR(50)

<br>

The **order_product** table schema is as follows:

-   **id**: SERIAL PRIMARY KEY
-   **order_id**: integer REFERENCES orders(id)
-   **product_id**: integer REFERENCES products(id)
-   **quantity**: integer

---

## Endpoints

#### Products

-   Index `/products` [GET]
-   Show `/products/:id` [GET]
-   Create `/products` [POST] [admin token required]
-   Delete `/products/:id` [DELETE] [admin token required]
-   [OPTIONAL] Products by category (params: product category) `/products/category/:category` [GET]

<br>

#### Users

-   Index `/users` [GET] [admin token required]
-   Show `/users/:id` [GET] [admin token required]
-   Create `/users` [POST]
-   Delete `/users/:id` [DELETE] [admin token required]

<br>

#### Orders

-   Index `/orders` [GET] [admin token required]
-   Create `/orders` [POST] [user token required]
-   Current Order by user `/orders/users/:user_id/current` [GET] (args: user id) [user token required]
-   [OPTIONAL] Completed Orders by user `/orders/users/:user_id/completed` [GET] (args: user id) [admin or user token required]
-   Products in order `/orders/:order_id/products` [GET] [user token required]
-   Add product to order `/orders/:order_id/products/:product_id` [POST]
-   Mark order as complete `/orders/:id` [PUT]

---

## File Structure

    ├── node_modules
    ├── migrations
    │      ├── sqls
    │      │    ├── 20220807095709-users-table-down.sql
    │      │    ├── 20220807095709-users-table-up.sql
    │      │    ├── 20220807095739-products-table-down.sql
    │      │    ├── 20220807095739-products-table-up.sql
    │      │    ├── 20220807095801-orders-table-down.sql
    │      │    ├── 20220807095801-orders-table-up.sql
    │      │    ├── 20220807095830-order-product-table-down.sql
    │      │    └── 20220807095830-order-product-table-up.sql
    │      ├──  20220807095709-users-table.js
    │      ├──  20220807095739-products-table.js
    │      ├──  20220807095801-orders-table.js
    │      └──  20220807095830-order-product-table.js
    ├── spec
    │      └── support
    │           └── jasmine.json
    ├── src
    │     ├──  handlers
    │     │     ├── orders.ts
    │     │     ├── products.ts
    │     │     └── users.ts
    │     ├──  middlewares
    │     │     └── authenticator.ts
    │     ├──  models
    │     │     ├── Order.ts
    │     │     ├── Product.ts
    │     │     └── User.ts
    │     ├──  tests
    │     │     ├── helpers
    │     │     │     └── reporter.ts
    │     │     ├──  handlers
    │     │     │     ├── ordersSpec.ts
    │     │     │     ├── productsSpec.ts
    │     │     │     └── usersSpec.ts
    │     │     └──  models
    │     │           ├── OrderSpec.ts
    │     │           ├── ProductSpec.ts
    │     │           └── UserSpec.ts
    │     ├──  database.ts
    │     └──  server.ts
    ├── .env
    ├── .eslintignore
    ├── .eslintrc.json
    ├── .gitignore
    ├── .prettierignore
    ├── .prettierrc.json
    ├── database.json
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── REQUIREMENTS.md
    └── tsconfig.json

---

## Appendix

The environment variables should never be uploaded or exposed anywhere online, but as this is an experimental project and for a better reviewing experience. The environment variables used are:

-   **POSTGRES_HOST**=127.0.0.1
-   **POSTGRES_DB**=storefront
-   **POSTGRES_TEST_DB**=storefront_test
-   **POSTGRES_USER**=postgres
-   **POSTGRES_PASSWORD**=password123
-   **ENV**=dev
-   **BCRYPT_PASSWORD**=secretpepper123
-   **SALT_ROUNDS**=10
-   **TOKEN_SECRET**=secrettoken123
