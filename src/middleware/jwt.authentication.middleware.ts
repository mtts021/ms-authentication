import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import ForbiddenError from "../models/forbidden.error.models";

async function jwtAuthenticationMiddleware(req: Request, res: Response, next: NextFunction){

    try {
        const authenticationHeaders = req.headers['authorization']

        if(!authenticationHeaders){
            throw new ForbiddenError('Credencias não informados');
        }

        const [authenticationType, token] = authenticationHeaders.split(' ');

        if(authenticationType !== 'Bearer' || !token){
            throw new ForbiddenError('Tipo de autenticação inválida')
        }

        try {
            const tokenPayload =  JWT.verify(token, 'my_secret_key')

            if(typeof tokenPayload !== 'object' || !tokenPayload.sub){
                throw new ForbiddenError('Token inválido')
            }
            const user = {
                uuid: tokenPayload.sub, 
                username: tokenPayload.username
            }
    
            req.user = user
            next();
            
        } catch (error) {
            throw new ForbiddenError('Tipo de autenticação inválida')
        }


    } catch (error) {
        next(error)
    }
}

export default jwtAuthenticationMiddleware;