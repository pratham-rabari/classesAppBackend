'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define the foreign keys
    await queryInterface.addConstraint('Users', {
      type: 'foreign key',
      fields: ['roleId'],
      name: 'fk_roleId_users',
      references: {
        table: 'Roles',
        field: 'roleId'
      },
    });

    await queryInterface.addConstraint('Users', {
      type: 'foreign key',
      fields: ['CUID'],
      name: 'fk_users_cuid',
      references: {
        table: 'Users',
        field: 'userId'
      }
    });

    await queryInterface.addConstraint('Users', {
      type: 'foreign key',
      fields: ['MUID'],
      name: 'fk_users_muid',
      references: {
        table: 'Users',
        field: 'userId'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the foreign keys
    await queryInterface.removeColumn('Users', 'roleId');
    await queryInterface.removeColumn('Users', 'CUID');
    await queryInterface.removeColumn('Users', 'MUID');
  },
};