import mysql from "mysql"
import dotenv from "dotenv"
dotenv.config();
export const db = mysql.createConnection(
    {
        host:process.env.MONGO_HOST,
        user:process.env.MONGO_USER,
        password:process.env.MONGO_PASSWORD,
        database:process.env.MONGO_DATABASE
    }
)