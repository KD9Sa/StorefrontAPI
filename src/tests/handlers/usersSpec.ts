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

const tempUser2: User = {
    first_name: 'Mahmoud',
    last_name: 'Ahmed',
    password: 'pass456',
    authority: 'user'
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

    it('returns status 200 for POST req on endpoint /users', async (): Promise<void> => {
        const response = await request
            .post('/users')
            .set('Authorization', 'bearer ' + token)
            .send(tempUser2);
        expect(response.status).toBe(200);
    });

    it('returns status 200 for GET req on endpoint /users', async (): Promise<void> => {
        const response = await request
            .get('/users')
            .set('Authorization', 'bearer ' + token);
        expect(response.status).toBe(200);
    });

    it('returns status 200 for GET req on endpoint /users/authenticate', async (): Promise<void> => {
        const response = await request
            .get('/users/authenticate')
            .set('Authorization', 'bearer ' + token)
            .send({id: 2, password: 'pass456'});
        expect(response.status).toBe(200);
    });

    it('returns status 200 for GET req on endpoint /users/2', async (): Promise<void> => {
        const response = await request
            .get('/users/2')
            .set('Authorization', 'bearer ' + token);
        expect(response.status).toBe(200);
    });

    it('returns status 200 for DELETE req on endpoint /users/2', async (): Promise<void> => {
        const response = await request
            .delete('/users/2')
            .set('Authorization', 'bearer ' + token);
        expect(response.status).toBe(200);
    });
});
