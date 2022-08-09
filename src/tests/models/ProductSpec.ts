import { client } from '../../database';
import { ProductStore } from '../../models/Product';

const prStore = new ProductStore();

describe('Product Model', (): void => {
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

    describe('Methods Exist', (): void => {
        it('should check if index method is defined', (): void => {
            expect(prStore.index).toBeDefined();
        });

        it('should check if show method is defined', (): void => {
            expect(prStore.show).toBeDefined();
        });

        it('should check if show method is defined', (): void => {
            expect(prStore.showByCategory).toBeDefined();
        });

        it('should check if show method is defined', (): void => {
            expect(prStore.create).toBeDefined();
        });

        it('should check if show method is defined', (): void => {
            expect(prStore.delete).toBeDefined();
        });
    });

    describe('Methods functionality', (): void => {
        it('should create a new product', async (): Promise<void> => {
            const result = await prStore.create({
                name: 'Lenovo Ideapad',
                price: 3499,
                category: 'Computers'
            });

            expect(result).toEqual({
                id: 1 as unknown as string,
                name: 'Lenovo Ideapad',
                price: 3499,
                category: 'Computers'
            });
        });

        it('should get all products', async (): Promise<void> => {
            const result = await prStore.index();

            expect(result).toEqual([
                {
                    id: 1 as unknown as string,
                    name: 'Lenovo Ideapad',
                    price: 3499,
                    category: 'Computers'
                }
            ]);
        });

        it('should get a product by id', async (): Promise<void> => {
            const result = await prStore.show('1');

            expect(result).toEqual({
                id: 1 as unknown as string,
                name: 'Lenovo Ideapad',
                price: 3499,
                category: 'Computers'
            });
        });

        it('should get products by category', async (): Promise<void> => {
            const result = await prStore.showByCategory('Computers');

            expect(result).toEqual([
                {
                    id: 1 as unknown as string,
                    name: 'Lenovo Ideapad',
                    price: 3499,
                    category: 'Computers'
                }
            ]);
        });

        it('should delete a product', async (): Promise<void> => {
            const result = await prStore.delete('1');

            expect(result).toBeUndefined;
        });
    });
});
