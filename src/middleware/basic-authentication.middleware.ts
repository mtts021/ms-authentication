import { Request, Response, NextFunction } from "express";
import userRepository from "../database/repositories/userRepository";
import ForbiddenError from "../models/forbidden.error.models";


async function basicAuthenticationMiddleware(req: Request, res: Response, next: NextFunction){

    try {
        const authenticationHeaders = req.headers['authorization']

        if(!authenticationHeaders){
            throw new ForbiddenError('Credencias não informados');
        }

        const [authenticationType, token] = authenticationHeaders.split(' ');

        if(authenticationType !== 'Basic' || !token){
            throw new ForbiddenError('Tipo de autenticação inválida')
        }

        const tokenContent = Buffer.from(token, 'base64').toString('utf-8')

        const [username, password] = tokenContent.split(':')

        if(!username || !password){
            throw new ForbiddenError('Credencias não preenchidas')
        }

        const user = await userRepository.findByUsernameAndPassword(username, password)
        
        if(!user){
            throw new ForbiddenError('Usuários ou senha inválidos')
        }

        req.user = user;
        
        next();
    } catch (error) {
        next(error);
    }
}

export default basicAuthenticationMiddleware