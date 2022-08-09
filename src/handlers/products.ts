import { Application, Request, Response } from 'express';
import { Product, ProductStore } from '../models/Product';
import { verifyAdmin } from '../middlewares/authenticator';

const store = new ProductStore();

const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const productsList = await store.index();
        res.json(productsList);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const product = await store.show(id);
        res.json(product);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const getProductsByCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const category = req.params.category;
        const products = await store.showByCategory(category);
        res.json(products);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product: Product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch (error) {
        res.status(400);
        res.send(error);
        console.log(error);
    }
};

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const deletedProduct = await store.delete(id);
        res.json(deletedProduct);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const productRoutes = (app: Application): void => {
    app.get('/products', getAllProducts);
    app.get('/products/:id', getProductById);
    app.get('/products/category/:category', getProductsByCategory);
    app.post('/products', verifyAdmin, createProduct);
    app.delete('/products/:id', verifyAdmin, deleteProduct);
};

export default productRoutes;
