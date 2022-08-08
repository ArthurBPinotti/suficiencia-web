'use strict';

const { Model } = require('sequelize');
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
class Registro extends Model {
    isPasswordValid(password) {
        return bcrypt.compareSync(password, this.password);
    }
};

Registro.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(password) {
            this.setDataValue("password", bcrypt.hashSync(password, 10));
        }
    }
}, {
    sequelize,
    modelName: 'Registro',
});
return Registro;
};