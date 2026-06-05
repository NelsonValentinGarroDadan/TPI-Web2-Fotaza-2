'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('images_tags', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      image_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Images', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tag_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Tags', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addConstraint('images_tags', {
      fields: ['image_id', 'tag_id'],
      type: 'unique',
      name: 'uq_image_tag',
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('images_tags');
  },
};
