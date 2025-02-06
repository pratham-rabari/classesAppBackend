module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Users', {
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        userName: {
          type: Sequelize.STRING(30),
          allowNull: false,
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
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        salary:{
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING(70),
          allowNull: true,
        },
        password: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        phoneNo: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        dob: {
          type: Sequelize.DATE,
          allowNull: true
        },
        hireDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        qualification: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        experience: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        roleId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Roles',
            key: 'roleId',
          },
        },
        forgotPwdToken: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
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
      await queryInterface.dropTable('Users');
    },
  };
  