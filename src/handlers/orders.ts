import { Application, Request, Response } from 'express';
import { Order, OrderStore } from '../models/Order';
import { verifyAdmin, verifyUser } from '../middlewares/authenticator';

const store = new OrderStore();

const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const ordersList = await store.index();
        res.json(ordersList);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const getCurrentOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.user_id;
        const order = await store.showCurrentOrder(id);
        res.json(order);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const getCompletedOrders = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = req.params.user_id;
        const order = await store.showCompletedOrders(id);
        res.json(order);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const getOrderProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.order_id;
        const order = await store.showProductsInOrder(id);
        res.json(order);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const order: Order = {
            user_id: req.body.user_id
        };
        const newOrder = await store.create(order);
        res.json(newOrder);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const addProductToOrder = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const order_id = req.params.order_id;
        const product_id = req.params.product_id;
        const quantity = req.body.quantity;

        const addedProduct = await store.addProductToOrder(
            order_id,
            product_id,
            quantity
        );
        res.json(addedProduct);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const completeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const deletedOrder = await store.updateToComplete(id);
        res.json(deletedOrder);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const orderRoutes = (app: Application): void => {
    app.get('/orders', verifyAdmin, getAllOrders);
    app.get('/orders/users/:user_id/current', verifyUser, getCurrentOrder);
    app.get('/orders/users/:user_id/completed', verifyUser, getCompletedOrders);
    app.get('/orders/:order_id/products', verifyUser, getOrderProducts);
    app.post('/orders', verifyUser, createOrder);
    app.post(
        '/orders/:order_id/products/:product_id',
        verifyUser,
        addProductToOrder
    );
    app.put('/orders/:id', verifyUser, completeOrder);
};

export default orderRoutes;
