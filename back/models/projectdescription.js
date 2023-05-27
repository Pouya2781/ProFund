'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectDescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Project}) {
      // define association here
      this.belongsTo(Project,{foreignKey: "projectId"})
    }
  }
  ProjectDescription.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mainPic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    presentation: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'ProjectDescription',
    tableName: 'projectdescription'
  });
  return ProjectDescription;
};