'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    static associate(models) {
      this.belongsTo(models.Comanda, {foreignKey: "idComanda", as: "comanda"})
    }
  };
  Produto.init({
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idComanda:{
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    preco: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Produto',
  });
  return Produto;
};