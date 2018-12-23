const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = db.sequelize.define(
    'advertisement',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING
        },
        auther: {
            type: Sequelize.STRING
        },
        body: {
            type: Sequelize.STRING

        }
    },
    {
        timestamps: false
    }
)