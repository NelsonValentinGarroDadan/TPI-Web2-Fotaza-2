'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      reason: { allowNull: false, type: Sequelize.STRING },
      description: { allowNull: false, type: Sequelize.STRING(250) },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      image_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'Images', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      comment_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'Comments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // Una denuncia apunta a una imagen o a un comentario, nunca a ambos ni a ninguno
    await queryInterface.sequelize.query(
      'ALTER TABLE "Reports" ADD CONSTRAINT chk_report_target CHECK (((image_id IS NOT NULL)::int + (comment_id IS NOT NULL)::int) = 1);'
    );

    // Un usuario no puede denunciar dos veces la misma imagen / el mismo comentario
    await queryInterface.addConstraint('Reports', {
      fields: ['user_id', 'image_id'],
      type: 'unique',
      name: 'uq_user_image_report',
    });

    await queryInterface.addConstraint('Reports', {
      fields: ['user_id', 'comment_id'],
      type: 'unique',
      name: 'uq_user_comment_report',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Reports');
  },
};
