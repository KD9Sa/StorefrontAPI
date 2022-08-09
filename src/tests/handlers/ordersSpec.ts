import app from '../../server';
import supertest from 'supertest';
import { client } from '../../database';
import { User } from '../../models/User';
import { Order } from '../../models/Order';
import { Product } from '../../models/Product';

const request = supertest(app);
let token: string;

const tempOrder: Order = {
    user_id: '1'
};

const tempUser: User = {
    first_name: 'Khalid',
    last_name: 'Saleh',
    password: 'pass123',
    authority: 'admin'
};

const tempProduct: Product = {
    name: 'Apple Watch',
    price: 2499,
    category: 'Electronics'
};

describe('Order Handler', (): void => {
    beforeAll(async (): Promise<void> => {
        try {
            const conn = await client.connect();
            const sql =
                'TRUNCATE users, products, orders, order_product RESTART IDENTITY CASCADE';
            await conn.query(sql);
            conn.release();

            token = await (await request.post('/users').send(tempUser)).body;
            await request
                .post('/products')
                .set('Authorization', 'bearer ' + token)
                .send(tempProduct);
        } catch (error) {
            console.log(error);
        }
    });

    it('returns status 200 for POST req on endpoint /orders', async (): Promise<void> => {
        const response = await request
            .post('/orders')
            .set('Authorization', 'bearer ' + token)
            .send(tempOrder);
        expect(response.status).toBe(200);
    });

    it('returns status 200 for POST req on endpoint /orders/1/products/1', async (): Promise<void> => {
        const response = await request
            .post('/orders/1/products/1')
            .set('Authorization', 'bearer ' + token)
            .send({ quantity: '5' });
        expect(response.status).toBe(200);
    });

    it('returns status 200 for GET req on endpoint /orders', async (): Promise<void> => {
        const response = await request
            .get('/orders')
            .set('Authorization', 'bearer ' + token);
        expect(response.status).toBe(200);
    });

    it('returns status 200 for GET req on endpoint /orders/users/1/current', async (): Promise<void> => {
        const response = await request
            .get('/orders/users/1/current')
            .set('Authorization', 'bearer ' + token);
        expect(response.status).toBe(200);
    });

    it('returns status 200 for GET req on endpoint /orders/1/products', async (): Promise<void> => {
        const response = await request
            .get('/orders/1/products')
            .set('Authorization', 'bearer ' + token);
        expect(response.status).toBe(200);
    });

    it('returns status 200 for PUT req on endpoint /orders/1', async (): Promise<void> => {
        const response = await request
            .put('/orders/1')
            .set('Authorization', 'bearer ' + token);
        expect(response.status).toBe(200);
    });

    it('returns status 200 for GET req on endpoint /orders/users/1/completed', async (): Promise<void> => {
        const response = await request
            .get('/orders/users/1/completed')
            .set('Authorization', 'bearer ' + token);
        expect(response.status).toBe(200);
    });
});
