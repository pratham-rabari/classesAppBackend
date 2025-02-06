// Define the ActivityLog model
module.exports = (sequelize, DataTypes) => {
  let ActivityLog = sequelize.define('ActivityLog',
    {
      logId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the referenced table (Users table)
          key: 'userId', // Name of the referenced column (userId)
        },
      },
      module: {
        type: DataTypes.STRING(50),
        allowNull: false,
        // User Login
        // Forgot Password
        // Reset Password
        // Standard
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      CDT: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'ActivityLogs', // Change 'activityLogs' to your actual table name
      timestamps: false, // Set to true if you have createdAt and updatedAt columns
    }
  );
  ActivityLog.associate = function (models: any) {
    this.belongsTo(models.User, { foreignKey: "userId" });
  }
  return ActivityLog;
};