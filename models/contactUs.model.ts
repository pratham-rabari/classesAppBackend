// Define the ContactUs model
module.exports = (sequelize, DataTypes) => {
  let ContactUs = sequelize.define('ContactUs',
    {
      contactUsId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      message: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      isReplied: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      replyMessage: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      repliedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the referenced table (Users table)
          key: 'userId', // Name of the referenced column (userId)
        },
      },
      repliedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      CDT: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'ContactUs', // Change 'ContactUs' to your actual table name
      timestamps: false, // Set to true if you have createdAt and updatedAt columns
    }
  );
  ContactUs.associate = function (models: any) {
    this.belongsTo(models.User, { foreignKey: "userId" });
  }
  return ContactUs;
};
