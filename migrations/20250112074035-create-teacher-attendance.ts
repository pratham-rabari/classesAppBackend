'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('teacherAttendance', {
      attendanceId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      classId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Change to `false` if NOT NULL is required
        references: {
          model: 'ClassSchedule', // Table name in the database
          key: 'classId',
        },
        onDelete: 'SET NULL', // Change to `CASCADE` or `RESTRICT` as needed
        onUpdate: 'CASCADE',
      },
      teacherId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Table name in the database
          key: 'userId',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      attendanceStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      CUID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      MDT: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('teacherAttendance');
  },
};
