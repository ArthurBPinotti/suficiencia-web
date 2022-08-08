'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Comanda extends Model {
    static associate(models) {
      this.hasMany(models.Produto, { foreignKey: "idComanda" })
    }
  };
  Comanda.init({
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idUsuario: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    nomeUsuario: {
      allowNull: false,
      type: DataTypes.STRING
    },
    telefoneUsuario: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Comanda',
  });
  return Comanda;
};