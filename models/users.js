'use strict';
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define(
    'users',
    {
      UserId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      FirstName: {
        type: DataTypes.STRING
      },
      LastName: {
        type: DataTypes.STRING
      },
      Email: {
        type: DataTypes.STRING,
        unique: true
      },
      Username: {
        type: DataTypes.STRING,
        unique: true
      },
      Admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      Deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      Password: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    },
    {}
  );

  return users;
};