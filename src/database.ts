import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_TEST_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    ENV,
    BCRYPT_PASSWORD,
    SALT_ROUNDS,
    TOKEN_SECRET
} = process.env;

const client = new Pool({
    host: POSTGRES_HOST,
    database: ENV === 'dev' ? POSTGRES_DB : POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
});

export { client, BCRYPT_PASSWORD, SALT_ROUNDS, TOKEN_SECRET };
