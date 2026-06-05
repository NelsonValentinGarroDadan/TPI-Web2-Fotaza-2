'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      publication_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Publications', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      url: { allowNull: false, type: Sequelize.STRING },
      url_markwater: { type: Sequelize.STRING },
      order_number: { allowNull: false, type: Sequelize.INTEGER },
      license: { allowNull: false, type: Sequelize.STRING, defaultValue: 'sin_copyright' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Images');
  },
};
