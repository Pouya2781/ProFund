'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class projectDescription extends Model {
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
  projectDescription.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    main_pic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    presentation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creation_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'projectDescription',
  });
  return projectDescription;
};