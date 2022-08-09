import { client } from '../database';

export type Order = {
    id?: string;
    user_id: string;
    complete?: boolean;
};

export type OrderProduct = {
    id?: string;
    order_id?: string;
    product_id?: string;
    quantity: number;
};

export type OrderProducts = {
    id?: string;
    name: string;
    price: number;
    category: string;
    quantity: number;
};

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Unable to get orders list.\nError: ${error}`);
        }
    }

    async showCurrentOrder(user_id: string): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT * FROM orders WHERE user_id=$1 AND complete=false';
            const result = await conn.query(sql, [user_id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `Unable to get current order by user: ${user_id}.\nError: ${error}`
            );
        }
    }

    async showCompletedOrders(user_id: string): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders WHERE id=$1 AND complete=true';
            const result = await conn.query(sql, [user_id]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(
                `Unable to get completed orders by user: ${user_id}.\nError: ${error}`
            );
        }
    }

    async showProductsInOrder(order_id: string): Promise<OrderProducts[]> {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT products.id, products.name, products.category, products.price, order_product.quantity FROM products INNER JOIN order_product ON order_product.id = products.id AND order_product.order_id=$1;';
            const result = await conn.query(sql, [order_id]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(
                `Unable to get products in order: ${order_id}.\nError: ${error}`
            );
        }
    }

    async create(order: Order): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO orders(user_id, complete) VALUES ($1, $2) RETURNING *';
            const result = await conn.query(sql, [order.user_id, false]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to create order.\nError: ${error}`);
        }
    }

    async addProductToOrder(
        order_id: string,
        product_id: string,
        quantity: number
    ): Promise<OrderProduct> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO order_product(order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [
                order_id,
                product_id,
                quantity
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to add product to order.\nError: ${error}`);
        }
    }

    async updateToComplete(order_id: string): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = 'UPDATE orders SET complete=true WHERE id=$1';
            const result = await conn.query(sql, [order_id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(
                `Unable to complete order: ${order_id}.\nError: ${error}`
            );
        }
    }
}
