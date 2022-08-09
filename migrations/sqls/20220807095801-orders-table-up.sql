CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id) NOT NULL,
    complete boolean NOT NULL
);