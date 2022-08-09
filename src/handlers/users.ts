import { Application, Request, Response } from 'express';
import { User, UserStore } from '../models/User';
import { verifyAdmin, createUserToken } from '../middlewares/authenticator';

const store = new UserStore();

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const usersList = await store.index();
        res.json(usersList);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const user = await store.show(id);
        res.json(user);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
            authority: req.body.authority
        };
        const newUser = await store.create(user);
        const token = createUserToken(newUser);
        console.log(token);
        res.json(token);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const deletedUser = await store.delete(id);
        res.json(deletedUser);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const authenticateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.body.id;
        const password = req.body.password;
        const authenticatedUser = await store.authenticate(id, password);

        if (!authenticatedUser) {
            throw new Error('The id or password are incorrect.');
        }

        res.json(authenticatedUser);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const userRoutes = (app: Application): void => {
    app.get('/users', verifyAdmin, getAllUsers);
    app.get('/users/authenticate', verifyAdmin, authenticateUser);
    app.get('/users/:id', verifyAdmin, getUserById);
    app.post('/users', createUser);
    app.delete('/users/:id', verifyAdmin, deleteUser);
};

export default userRoutes;
