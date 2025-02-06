
module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Standards', {
        standardId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        standardIndex:{
          type: Sequelize.STRING(20),
          allowNull: false,
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
      await queryInterface.dropTable('Standards');
    },
  };
  