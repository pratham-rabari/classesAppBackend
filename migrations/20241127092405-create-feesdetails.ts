'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FeesDetails', {
      feeDetailId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Student',  // Referencing the 'Students' table
          key: 'studentId',   // The column in 'Students' table
        },
        onDelete: 'CASCADE', // Optional: handle deletion of related student
        onUpdate: 'CASCADE', // Optional: handle updates to related student
      },
      paymentDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      paymentType: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      installmentAmount:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
      },
      paidInstallmentAmount:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
      },
      pendingInstallmentAmount:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
      },
      installmentDate:{
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      chequeNumber:{
        type: Sequelize.STRING(30),
        defaultValue: null,
        allowNull: true,
      },
      bankName:{
        type: Sequelize.STRING(40),
        defaultValue: null,
        allowNull: true,
      },
      onlinePaymentService:{
        type:Sequelize.ENUM("Upi","NetBanking"),
        defaultValue: null,
        allowNull: true,
      },
      status:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      CUID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',  // Referencing the 'Users' table
          key: 'userId',   // The column in 'Users' table
        },
        onDelete: 'SET NULL', // Optional: handle deletion of related user
        onUpdate: 'CASCADE',  // Optional: handle updates to related user
      },
      CDT: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      MUID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',  // Referencing the 'Users' table
          key: 'userId',   // The column in 'Users' table
        },
        onDelete: 'SET NULL', // Optional: handle deletion of related user
        onUpdate: 'CASCADE',  // Optional: handle updates to related user
      },
      MDT: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FeesDetails');
  },
};