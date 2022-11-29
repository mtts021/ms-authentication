import express from 'express';
import usersRouter  from './routes/usersRoute';
import statusRouter from './routes/statusRoute';
import errorHandler from './middleware/error-handler.middleware';
import authorizationRoute from './routes/authorizationRoute';
import jwtAuthenticationMiddleware from './middleware/jwt.authentication.middleware';

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(statusRouter);
app.use(authorizationRoute);

app.use(jwtAuthenticationMiddleware)
app.use(usersRouter);

app.use(errorHandler);


app.listen(port, () => {
    console.log(`Aplicação rodando em: http://localhost:${port}`)
});

