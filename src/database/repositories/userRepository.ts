import db from "..";
import DatabaseError from "../../models/database.error.models";
import { User } from "../../models/user.models"
import config from "config"

const authenticationCryptKey = config.get<string>('authentication.cryptKey');

class userRepository {

    async findAllUser(): Promise<User[]>{
        const query = 'SELECT uuid, username FROM user_aplication';

        const {rows} = await db.query(query)
        

        return rows || []
    };

   async findByid(uuid: string): Promise<User>{
        try{
            const query = `
            SELECT uuid, username 
            FROM user_aplication
            WHERE uuid = $1
            `;
    
            const values = [uuid]
    
            const {rows} = await db.query(query, values)
            const [user] = rows
            return user

        }catch(error){
            console.log(error)
            throw new DatabaseError('Erro na consulta por', error)
        }
   };

   async findByUsernameAndPassword(username: string, password: string): Promise<User>{
        const query = `
            SELECT uuid, username
            FROM user_aplication
            WHERE username = $1 
            AND password = crypt($2, '${authenticationCryptKey}')
        `
        const values = [username, password]
        const {rows} = await db.query<User>(query, values)
        const [user] = rows

        return user || null

   }

   async createUser(user: User): Promise<string>{
        const script = `
            INSERT INTO user_aplication(username, password) 
            VALUES($1, 
            crypt($2, '${authenticationCryptKey}'))
            RETURNING uuid;`;

        const values = [user.username, user.password]
        const {rows} = await db.query<{uuid: string}>(script, values)
        const [newUser]= rows

        return newUser.uuid
   };

   async updateUser(user: User): Promise<void>{
        const script = `
            UPDATE user_aplication
            SET
            username = $1, 
            password = crypt($2, '${authenticationCryptKey}')
            WHERE uuid = $3
            `;

        const values = [user.username, user.password, user.uuid]
        db.query(script, values)
    };

    async removeUser(uuid: string): Promise<void>{
        const script = `
        DELETE
        FROM user_aplication
        WHERE uuid = $1;`

        const values = [uuid]
        await db.query(script, values)
    }

}


export default new userRepository