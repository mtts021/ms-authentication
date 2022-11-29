import { Request, Response, NextFunction, Router } from "express";
import { StatusCodes } from "http-status-codes";
import JWT, { SignOptions } from "jsonwebtoken";
import basicAuthenticationMiddleware from "../middleware/basic-authentication.middleware";
import ForbiddenError from "../models/forbidden.error.models";
import config from "config"


const authorizationRoute = Router();

authorizationRoute.post('/token', basicAuthenticationMiddleware,async(req: Request, res: Response, next: NextFunction)=>{

    try {
        const user = req.user
        if(!user){
            throw new ForbiddenError('Usuário não informado')
        }
        const jwtPlayload = {username: user.username};
        const jwtOptions: SignOptions = {subject: user?.uuid, expiresIn: '5m'};
        const secretKey = config.get<string>('jtw.secretkey')
        const jwt = JWT.sign(jwtPlayload, secretKey, jwtOptions)

        res.status(StatusCodes.OK).json({token: jwt})
    } catch (error) {
        next(error)
    }


});

authorizationRoute.post("/token/validate", (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK)
})

export default authorizationRoute;