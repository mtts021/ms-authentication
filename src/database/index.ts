import config from "config"
import { Pool } from "pg";

const connectionString = config.get<string>('database.uri');


const db = new Pool({connectionString})

db.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }

})

export default db