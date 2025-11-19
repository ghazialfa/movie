"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsTo(models.User, { foreignKey: "UserId" });
      Favorite.belongsTo(models.Movie, { foreignKey: "MovieId" });
    }
  }
  Favorite.init(
    {
      MovieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "MovieId is required" },
          notEmpty: { msg: "MovieId is required" },
        },
        references: {
          model: "Movies",
          key: "id",
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "UserId is required" },
          notEmpty: { msg: "UserId is required" },
        },
        references: {
          model: "Users",
          key: "id",
        },
      },
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Favorite",
    }
  );
  return Favorite;
};
