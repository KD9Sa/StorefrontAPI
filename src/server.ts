import express, { Application, Request, Response } from 'express';
import userRoutes from './handlers/users';
import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

userRoutes(app);
orderRoutes(app);
productRoutes(app);

app.get('/', (req: Request, res: Response): void => {
    res.send('Home Page');
});

app.listen(port, (): void => {
    console.log(`Server is running on: http://localhost:${port}`);
});

export default app;
