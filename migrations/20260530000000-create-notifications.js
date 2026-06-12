'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      actor_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: { allowNull: false, type: Sequelize.STRING },
      image_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'Images', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      read_at: { allowNull: true, type: Sequelize.DATE },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.sequelize.query(
      "ALTER TABLE \"Notifications\" ADD CONSTRAINT chk_notification_type CHECK (type IN ('comment','rating','interest','follow','report'));"
    );

    await queryInterface.addIndex('Notifications', ['user_id', 'read_at'], {
      name: 'idx_notifications_user_read',
    });

    await queryInterface.addIndex('Notifications', ['user_id', 'createdAt'], {
      name: 'idx_notifications_user_created',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Notifications');
  },
};
