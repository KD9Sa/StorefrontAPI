import bcrypt from 'bcrypt';
import {
    client,
    BCRYPT_PASSWORD as pepper,
    SALT_ROUNDS as salt
} from '../database';

export type User = {
    id?: string;
    first_name: string;
    last_name: string;
    password: string;
    authority: string;
};

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Unable to get users list.\nError: ${error}`);
        }
    }

    async show(id: string): Promise<User> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users WHERE id=$1';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to get user: ${id}.\nError: ${error}`);
        }
    }

    async create(user: User): Promise<User> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO users(first_name, last_name, password, authority) VALUES ($1, $2, $3, $4) RETURNING *';
            const hash = bcrypt.hashSync(
                user.password + pepper,
                parseInt(salt as string)
            );
            const result = await conn.query(sql, [
                user.first_name,
                user.last_name,
                hash,
                user.authority
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to create user.\nError: ${error}`);
        }
    }

    async delete(id: string): Promise<User> {
        try {
            const conn = await client.connect();
            const sql = 'DELETE FROM users WHERE id=$1';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to delete user: ${id}.\nError: ${error}`);
        }
    }

    async authenticate(id: string, password: string): Promise<User | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users WHERE id=$1';
            const result = await conn.query(sql, [id]);

            // Applying the short-circuit operator '&&' the second argument will not run unless the
            // first is true.
            if (
                result.rows.length &&
                bcrypt.compareSync(password + pepper, result.rows[0].password)
            ) {
                return result.rows[0];
            }

            return null;
        } catch (error) {
            throw new Error(`Unable to authenticate user: ${id}.\nError: ${error}`);
        }
    }
}

export default UserStore;
