import { client } from '../../database';
import { UserStore } from '../../models/User';

const usStore = new UserStore();

describe('User Model', (): void => {
    describe('Methods Exist', (): void => {
        beforeAll(async (): Promise<void> => {
            try {
                const conn = await client.connect();
                const sql =
                    'TRUNCATE users, products, orders, order_product RESTART IDENTITY CASCADE';
                await conn.query(sql);
                conn.release();
            } catch (error) {
                console.log(error);
            }
        });

        it('should check if index method is defined', (): void => {
            expect(usStore.index).toBeDefined();
        });

        it('should check if index method is defined', (): void => {
            expect(usStore.show).toBeDefined();
        });

        it('should check if index method is defined', (): void => {
            expect(usStore.create).toBeDefined();
        });

        it('should check if index method is defined', (): void => {
            expect(usStore.delete).toBeDefined();
        });

        it('should check if index method is defined', (): void => {
            expect(usStore.authenticate).toBeDefined();
        });
    });

    describe('Methods functionality', (): void => {
        it('should create a new user', async (): Promise<void> => {
            const result = await usStore.create({
                first_name: 'Khalid',
                last_name: 'Saleh',
                password: 'pass123',
                authority: 'admin'
            });

            expect(result.first_name).toEqual('Khalid');
            expect(result.last_name).toEqual('Saleh');
            expect(result.authority).toEqual('admin');
        });

        it('should get all users', async (): Promise<void> => {
            const result = await usStore.index();

            expect(result[0].first_name).toEqual('Khalid');
            expect(result[0].last_name).toEqual('Saleh');
            expect(result[0].authority).toEqual('admin');
        });

        it('should get a user by id', async (): Promise<void> => {
            const result = await usStore.show('1');

            expect(result.first_name).toEqual('Khalid');
            expect(result.last_name).toEqual('Saleh');
            expect(result.authority).toEqual('admin');
        });

        it('should authenticate a user', async (): Promise<void> => {
            const result = await usStore.authenticate('1', 'pass123');

            expect(result).toBeDefined;
        });

        it('should delete a user', async (): Promise<void> => {
            const result = await usStore.delete('1');

            expect(result).toBeUndefined;
        });
    });
});
