'use strict';
module.exports = (sequelize, DataTypes) => {
  var posts = sequelize.define(
    'posts',
    {
      PostId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: {
        type: DataTypes.INTEGER,
        foreignKey: true
      },
      Deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      PostTitle: DataTypes.STRING,
      PostBody: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    },
    {}
  );

  return posts;
};
