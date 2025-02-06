'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attendance', {
      attendanceId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      teacherId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Referenced table
          key: 'userId',  // Referenced column
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      attendanceDetail: {
        type: Sequelize.JSON, // JSON data type
        allowNull: false,
      },
      CUID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Referenced table
          key: 'userId',  // Referenced column
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      CDT: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      MUID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Referenced table
          key: 'userId',  // Referenced column
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      MDT: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attendance');
  },
};

