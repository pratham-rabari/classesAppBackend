'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Exams', {
      examId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      standardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Standards', // Ensure the table name is correct
          key: 'standardId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Subjects', // Ensure the table name is correct
          key: 'subjectId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      totalMarks: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      passingMarks: {
        type: Sequelize.DECIMAL(5,1),
        allowNull: false,
      },
      examDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      chapterDetails: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      remarks: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      attendanceDetail:{
        type: Sequelize.JSON,  // JSON data type
        allowNull: false,
      },
      CUID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
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
          model: 'users',
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
    await queryInterface.dropTable('Exams');
  },
};