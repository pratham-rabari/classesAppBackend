'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ClassSchedule', {
      classId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      recurrenceTime: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      startDateTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endClassTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      duration: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      weekDays: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      standardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Standards',
          key: 'standardId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      teacherId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Subjects',
          key: 'subjectId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Pending',
      },
      classRuleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ClassRules',
          key: 'classRuleId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      CUID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
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
          model: 'Users',
          key: 'userId',
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
    await queryInterface.dropTable('ClassSchedule');
  },
};

