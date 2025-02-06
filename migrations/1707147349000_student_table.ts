module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Students", {
      studentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      standardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Standards',
          key: 'standardId',
        }
      },
      firstName: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(70),
        allowNull: true,
      },
      phoneNo: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
      },
      paymentType: {
        type: Sequelize.ENUM('OneTime', 'Installments'),
        allowNull: false,
      },
      totalFees: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      feesDueDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      addmissionDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      motherName: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      fatherName: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      parentContactNo: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      emergencyContactNo: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      installmentCount:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      CUID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the referenced table (Users table)
          key: 'userId', // Name of the referenced column (userId)
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
          model: 'Users', // Name of the referenced table (Users table)
          key: 'userId', // Name of the referenced column (userId)
        },
      },
      MDT: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Students');
  },
}