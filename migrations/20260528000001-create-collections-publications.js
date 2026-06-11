'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('collections_publications', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      collection_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Collections', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      publication_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Publications', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addConstraint('collections_publications', {
      fields: ['collection_id', 'publication_id'],
      type: 'unique',
      name: 'uq_collection_publication',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('collections_publications');
  },
};
