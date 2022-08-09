import app from '../../server';
import supertest from 'supertest';
import { client } from '../../database';
import { User } from '../../models/User';
import { Product } from '../../models/Product';

const request = supertest(app);
let token: string;

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

    it('returns status 200 for POST req on endpoint /products', async (): Promise<void> => {
        const response = await request
            .post('/products')
            .set('Authorization', 'bearer ' + token)
            .send(tempProduct);
        expect(response.status).toBe(200);
    });

    it('returns status 200 for GET req on endpoint /products', async (): Promise<void> => {
        const response = await request.get('/products');
        expect(response.status).toBe(200);
    });

    it('returns status 200 for GET req on endpoint /products/1', async (): Promise<void> => {
        const response = await request.get('/products/1');
        expect(response.status).toBe(200);
    });

    it('returns status 200 for GET req on endpoint /products/category/Electronics', async (): Promise<void> => {
        const response = await request.get('/products/category/Electronics');
        expect(response.status).toBe(200);
    });

    it('returns status 200 for DELETE req on endpoint /products/1', async (): Promise<void> => {
        const response = await request
            .delete('/products/1')
            .set('Authorization', 'bearer ' + token);
        expect(response.status).toBe(200);
    });
});
