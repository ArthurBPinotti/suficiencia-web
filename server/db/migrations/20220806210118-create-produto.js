'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Produtos', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
      },
      nome: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      preco: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2)
      },
      idComanda: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        references: {
          model: "Comandas",
          key: "id"
        },        
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Produtos');
  }
};