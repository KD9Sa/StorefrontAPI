# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

-   Index `/products` [GET]
-   Show `/products/:id` [GET]
-   Create `/products` [POST] [admin token required]
-   Delete `/products/:id` [DELETE] [admin token required]
-   [OPTIONAL] Products by category (params: product category) `/products/category/:category` [GET]

#### Users

-   Index `/users` [GET] [admin token required]
-   Show `/users/:id` [GET] [admin token required]
-   Create `/users` [POST]
-   Delete `/users/:id` [DELETE] [admin token required]

#### Orders

-   Index `/orders` [GET] [admin token required]
-   Create `/orders` [POST] [user token required]
-   Current Order by user `/orders/users/:user_id/current` [GET] (args: user id) [user token required]
-   [OPTIONAL] Completed Orders by user `/orders/users/:user_id/completed` [GET] (args: user id) [admin or user token required]
-   Products in order `/orders/:order_id/products` [GET] [user token required]
-   Add product to order `/orders/:order_id/products/:product_id` [POST]
-   Mark order as complete `/orders/:id` [PUT]

## Data Shapes

#### Product

-   id `SERIAL PRIMARY KEY`
-   name `VARCHAR(50)`
-   price `integer`
-   [OPTIONAL] category `VARCHAR(50)`

#### User

-   id `SERIAL PRIMARY KEY`
-   firstName `VARCHAR(50)`
-   lastName `VARCHAR(50)`
-   password `VARCHAR(100)`

#### Orders

-   id `SERIAL PRIMARY KEY`
-   user_id `integer REFERENCES users(id)`
-   complete `boolean`

#### Order_Product

-   id `SERIAL PRIMARY KEY`
-   order_id `integer REFERENCES orders(id)`
-   product_id `integer REFERENCES products(id)`
-   quantity `integer`
