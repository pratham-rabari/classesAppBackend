module.exports = function (sequelize, DataTypes) {
    let Expenses = sequelize.define('Expenses',
      {
        expenseId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          expenseAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
          expenseDate: {
            type: DataTypes.DATEONLY, 
            allowNull: false,
          },
          expenserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', 
                key: 'userId', 
              },
          },
          expenseType: {
            type: DataTypes.STRING(50),
            allowNull: false,
          },
          CUID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Users', 
                key: 'userId', 
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
                model: 'Users', 
                key: 'userId',
              },
          },
          MDT: {
            type: DataTypes.DATE,
            allowNull: true,
          },
      },
      {
        tableName: 'Expenses',
        timestamps: false
      }
    );
    Expenses.associate = function (models: any) {
      this.belongsTo(models.User, { foreignKey: 'CUID', as: 'createdBy' });
      this.belongsTo(models.User, { foreignKey: 'MUID', as: 'modifiedBy' }); 
      this.belongsTo(models.User, { as: 'user', foreignKey: "expenserId" });
    }
    return Expenses;
  }; 