'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Followers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      follower_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      followed_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // No se puede seguir dos veces al mismo usuario (req. del TP)
    await queryInterface.addConstraint('Followers', {
      fields: ['follower_id', 'followed_id'],
      type: 'unique',
      name: 'uq_follower_followed'
    });

    // Un usuario no puede seguirse a si mismo (req. del TP)
    await queryInterface.sequelize.query(
      'ALTER TABLE "Followers" ADD CONSTRAINT chk_no_self_follow CHECK (follower_id <> followed_id);'
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Followers');
  }
};
