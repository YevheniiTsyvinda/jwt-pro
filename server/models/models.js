const sequelize = require('../db')
const {DataTypes} = require('sequelize');
const { serialize } = require('pg-protocol');

const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, require: true},
    password: {type: DataTypes.STRING, require: true},
    isActivated: {type: DataTypes.BOOLEAN, default: false},
    activationLink: {type: DataTypes.STRING}
});

module.exports = {
    User,
};