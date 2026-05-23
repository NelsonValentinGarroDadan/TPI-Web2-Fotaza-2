const { Sequelize } = require('sequelize');
require('dotenv').config();

const host = process.env.DB_HOST || 'localhost';
const database = process.env.DB_NAME || 'fotaza2';
const username = process.env.DB_USERNAME || 'postgres';
const password = process.env.DB_PASSWORD || '';

const sequelize = new Sequelize(database,username,password,{
    host,
    dialect: 'postgres',
    logging: false
});

const connectDB = async () => {
    try{
        await sequelize.authenticate();
        console.log('Connected database')
    }catch(err) {
            console.log('The database could not be connected')
    };
}

module.exports = {
    sequelize,
    connectDB
};