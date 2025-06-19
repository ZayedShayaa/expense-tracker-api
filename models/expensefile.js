const { DataTypes } = require("sequelize");
const sequelize = require("../config/connect");

const ExpenseFile = sequelize.define(
  "ExpenseFile",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    expense_id: { type: DataTypes.INTEGER, allowNull: false },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true},
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "expense_files",
    timestamps: false,
    underscored: true,
    hooks: {
      beforeValidate: (file) => {
        if (file.file_url && !/^https?:\/\//.test(file.file_url)) {
          file.file_url = "https://" + file.file_url;
        }
      },
    },
  }
);

ExpenseFile.prototype.getPublicInfo = function () {
  return {
    id: this.id,
    filename: this.filename,
    url: this.file_url,
    uploaded_at: this.uploaded_at,
  };
};

module.exports = ExpenseFile;
