import express, {NextFunction, Request, Response} from 'express';
import taskRoutes from './routes/tasks';
import sequelize from "./models/dbconfig";

sequelize.sync({ force: true }).then(async () => {
    console.log("db is ready...");
});

const app = express();
let port = process.env.PORT || 3000;
if(process.env.NODE_ENV == 'test') {
    port = 0
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');
app.set("view engine", "pug");

app.use('/', taskRoutes);

// Add this error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app;
