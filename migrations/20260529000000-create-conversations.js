'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Conversations', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      image_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Images', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      buyer_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      seller_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addConstraint('Conversations', {
      fields: ['image_id', 'buyer_id'],
      type: 'unique',
      name: 'uq_conversation_image_buyer',
    });

    await queryInterface.sequelize.query(
      'ALTER TABLE "Conversations" ADD CONSTRAINT chk_conversation_distinct_users CHECK (buyer_id <> seller_id);'
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Conversations');
  },
};
