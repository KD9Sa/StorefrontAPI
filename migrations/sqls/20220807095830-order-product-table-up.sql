CREATE TABLE order_product (
    id SERIAL PRIMARY KEY,
    order_id integer REFERENCES orders(id) NOT NULL,
    product_id integer REFERENCES products(id) NOT NULL,
    quantity integer NOT NULL
);