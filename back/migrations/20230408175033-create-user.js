'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Users', {
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
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      verified: {
        type: DataTypes.BOOLEAN
      },
      birthDate: {
        type: DataTypes.DATEONLY
      },
      nationalCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      state: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.STRING
      },
      bio: {
        type: DataTypes.TEXT
      },
      idCardPic: {
        type: DataTypes.STRING
      },
      profilePic: {
        type: DataTypes.STRING
      },
      role: {
        type: DataTypes.STRING
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
    await queryInterface.dropTable('Users');
  }
};