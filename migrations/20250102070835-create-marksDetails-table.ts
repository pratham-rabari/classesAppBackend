'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MarksDetails', {
      marksDetailId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      examId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Exams', // Referenced table name
          key: 'examId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Student', // Referenced table name
          key: 'studentId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      totalMarks: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      scoredMarks: {
        type: Sequelize.DECIMAL(5, 1),
        allowNull: true,
      },
      CUID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Referenced table name
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
          model: 'Users', // Referenced table name
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
    await queryInterface.dropTable('MarksDetails');
  },
};
