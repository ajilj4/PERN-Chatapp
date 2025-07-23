const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    String(process.env.DB_PASS),
    {
        host: process.env.DB_HOST,
        dialect:'postgres',
        logging: false,
        dialectOptions: {
            ssl: false
        }
    }
)

module.exports = sequelize
