import { client } from '../../database';
import { OrderStore } from '../../models/Order';
import { UserStore } from '../../models/User';
import { ProductStore } from '../../models/Product';

const orStore = new OrderStore();
const usStore = new UserStore();
const prStore = new ProductStore();

describe('Order Model', (): void => {
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
            expect(orStore.index).toBeDefined();
        });

        it('should check if showCurrentOrder method is defined', (): void => {
            expect(orStore.showCurrentOrder).toBeDefined();
        });

        it('should check if showCompletedOrder method is defined', (): void => {
            expect(orStore.showCompletedOrders).toBeDefined();
        });

        it('should check if showProductsInOrder method is defined', (): void => {
            expect(orStore.showProductsInOrder).toBeDefined();
        });

        it('should check if addProductToOrder method is defined', (): void => {
            expect(orStore.addProductToOrder).toBeDefined();
        });

        it('should check if updateToComplete method is defined', (): void => {
            expect(orStore.updateToComplete).toBeDefined();
        });
    });

    describe('Methods Functionality', (): void => {
        it('should create a new order', async (): Promise<void> => {
            const tempUser = await usStore.create({
                first_name: 'Mahmoud',
                last_name: 'Ahmed',
                password: 'pass456',
                authority: 'user'
            });

            const result = await orStore.create({
                user_id: tempUser.id as string
            });

            expect(result).toEqual({
                id: 1 as unknown as string,
                user_id: 1 as unknown as string,
                complete: false
            });
        });

        it('should get all orders', async (): Promise<void> => {
            const result = await orStore.index();
            expect(result).toEqual([
                {
                    id: 1 as unknown as string,
                    user_id: 1 as unknown as string,
                    complete: false
                }
            ]);
        });

        it('should get current order', async (): Promise<void> => {
            const result = await orStore.showCurrentOrder('1');
            expect(result).toEqual({
                id: 1 as unknown as string,
                user_id: 1 as unknown as string,
                complete: false
            });
        });

        it('should add a product to the order', async (): Promise<void> => {
            prStore.create({
                name: 'Apple Watch',
                price: 2499,
                category: 'Electronics'
            });

            const result = await orStore.addProductToOrder('1', '1', 5);
            expect(result).toEqual({
                id: 1 as unknown as string,
                order_id: 1 as unknown as string,
                product_id: 1 as unknown as string,
                quantity: 5
            });
        });

        it('should get all products in the order', async (): Promise<void> => {
            const result = await orStore.showProductsInOrder('1');
            expect(result).toEqual([
                {
                    id: 1 as unknown as string,
                    name: 'Apple Watch',
                    price: 2499,
                    category: 'Electronics',
                    quantity: 5
                }
            ]);
        });

        it('should update order complete to true', async (): Promise<void> => {
            const conn = await client.connect();
            await orStore.updateToComplete('1');
            const sql = 'SELECT * FROM orders WHERE id=$1';
            const result = await conn.query(sql, ['1']);
            expect(result.rows[0]).toEqual({
                id: 1 as unknown as string,
                user_id: 1 as unknown as string,
                complete: true
            });
        });

        it('should get all completed orders', async (): Promise<void> => {
            const result = await orStore.showCompletedOrders('1');
            expect(result).toEqual([
                {
                    id: 1 as unknown as string,
                    user_id: 1 as unknown as string,
                    complete: true
                }
            ]);
        });
    });
});
