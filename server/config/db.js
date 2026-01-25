const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite Connected for AuraFinance');
        await sequelize.sync(); // Creates tables if they don't exist
        console.log('Database Synced');
    } catch (error) {
        console.error('Database Error:', error);
    }
};

module.exports = { sequelize, connectDB };
