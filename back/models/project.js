'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, ProjectDescription, Token, Donate, Comment, Like}) {
      // define association here
      this.belongsTo(User, {foreignKey: "userId"})
      this.hasOne(ProjectDescription, {foreignKey: "projectId"})
      this.hasMany(Token, {foreignKey: "projectId"})
      this.hasMany(Donate, {foreignKey: "projectId"})
      this.hasMany(Comment, {foreignKey: "projectId"})
      this.hasOne(Like, {foreignKey: "projectId"})
    }
  }
  Project.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    goal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    invested_amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    investor_count: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    has_donate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    has_token: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiration_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creation_date: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'projects'
  });
  return Project;
};