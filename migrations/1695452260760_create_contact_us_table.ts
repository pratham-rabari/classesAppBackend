module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ContactUs', {
      contactUsId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      message: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      isReplied: {
        type: Sequelize.STRING(6),
        allowNull: true,
      },
      replyMessage: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      repliedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
      repliedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      CDT: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ContactUs');
  },
};
