// Define the Company model
module.exports = function(sequelize, DataTypes) {
  let Company = sequelize.define('Company',
    {
      companyId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      registrationNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contactName: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      phoneNo: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      website: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      gstin: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        // 0 = Inactive, 1 = Active
      },
      CUID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Name of the referenced table (Users table)
          key: 'userId', // Name of the referenced column (userId)
        },
      },
      CDT: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      MUID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Name of the referenced table (Users table)
          key: 'userId', // Name of the referenced column (userId)
        },
      },
      MDT: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'Companies', // Change 'Companies' to your actual table name
      timestamps: false, // Set to true if you have createdAt and updatedAt columns
    }
  );
  Company.associate = function (models: any) {
    this.belongsTo(models.User, { as: 'creator', foreignKey: "CUID" });
    this.belongsTo(models.User, { as: 'modifier', foreignKey: "MUID" });
  }
  return Company;
};
