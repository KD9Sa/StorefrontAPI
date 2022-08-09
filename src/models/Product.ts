import { client } from '../database';

export type Product = {
    id?: string;
    name: string;
    price: number;
    category: string;
};

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Unable to get products list.\nError: ${error}`);
        }
    }

    async show(id: string): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE id=$1';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to get product: ${id}.\nError: ${error}`);
        }
    }

    async showByCategory(category: string): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE category=$1';
            const result = await conn.query(sql, [category]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(
                `Unable to get products in category: ${category}.\nError: ${error}`
            );
        }
    }

    async create(product: Product): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO products(name, price, category) VALUES ($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [
                product.name,
                product.price,
                product.category
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to create product.\nError: ${error}`);
        }
    }

    async delete(id: string): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql = 'DELETE FROM products WHERE id=$1';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `Unable to delete product: ${id}.\nError: ${error}`
            );
        }
    }
}
