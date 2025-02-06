'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Expenses', {
      expenseId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      expenseAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      expenseDate: {
        type: Sequelize.DATEONLY, 
        allowNull: false,
      },
      expenserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', 
            key: 'userId', 
          },
      },
      expenseType: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      CUID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Users', 
            key: 'userId', 
          },
      },
      CDT: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      MUID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Users', 
            key: 'userId',
          },
      },
      MDT: {
        type: Sequelize.DATE,
        allowNull: true,
      },
  });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Expenses');
  },
};

