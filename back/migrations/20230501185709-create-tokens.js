'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      limit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      creation_date: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tokens');
  }
};