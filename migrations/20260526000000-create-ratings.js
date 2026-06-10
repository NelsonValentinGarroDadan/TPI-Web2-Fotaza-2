'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ratings', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      image_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Images', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      value: { allowNull: false, type: Sequelize.INTEGER },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // Una sola valoracion por usuario e imagen (no se puede editar)
    await queryInterface.addConstraint('Ratings', {
      fields: ['user_id', 'image_id'],
      type: 'unique',
      name: 'uq_user_image_rating',
    });

    // El puntaje va de 1 a 5
    await queryInterface.sequelize.query(
      'ALTER TABLE "Ratings" ADD CONSTRAINT chk_value_range CHECK (value BETWEEN 1 AND 5);'
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Ratings');
  },
};
