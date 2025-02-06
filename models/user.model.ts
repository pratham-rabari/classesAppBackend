// Define the User model
module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define('User',
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      salary:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      phoneNo: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: true
      },
      hireDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      qualification: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      experience: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles', // Name of the referenced table (Roles table)
          key: 'roleId', // Name of the referenced column (roleId)
        },
      },
      forgotPwdToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
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
      tableName: 'Users', // Change 'Users' to your actual table name
      timestamps: false, // Set to true if you have createdAt and updatedAt columns
    }
  );
  User.associate = function (models: any) {
    this.hasMany(models.Standard, { foreignKey: 'CUID'});
    this.hasMany(models.Expenses, { as: 'expenses', foreignKey: 'expenserId' });
    this.belongsTo(models.Role, { foreignKey: "roleId" });
    this.belongsTo(models.User, { as: 'creator', foreignKey: "CUID" });
    this.belongsTo(models.User, { as: 'modifier', foreignKey: "MUID" });
  }
  return User;
};
