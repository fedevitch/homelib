import { Sequelize } from "sequelize";

const sequelize = 
    new Sequelize({
        database: process.env.DB_NAME, 
        port: Number.parseInt(process.env.DB_PORT || "5432", 10),
        username: process.env.DB_USER, 
        password: process.env.DB_PASSWORD,    
        dialect: "postgres",        
        logging: console.log
    });

export default sequelize;