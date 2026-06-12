'use strict';

const INDEXES = [
  { table: 'Publications', fields: ['user_id'], name: 'idx_publications_user_id' },
  { table: 'Images', fields: ['publication_id'], name: 'idx_images_publication_id' },
  { table: 'images_tags', fields: ['tag_id'], name: 'idx_images_tags_tag_id' },
  { table: 'Ratings', fields: ['image_id'], name: 'idx_ratings_image_id' },
  { table: 'Comments', fields: ['image_id'], name: 'idx_comments_image_id' },
  { table: 'Comments', fields: ['user_id'], name: 'idx_comments_user_id' },
  { table: 'Collections', fields: ['user_id'], name: 'idx_collections_user_id' },
  { table: 'collections_publications', fields: ['publication_id'], name: 'idx_collections_publications_publication_id' },
  { table: 'Reports', fields: ['image_id'], name: 'idx_reports_image_id' },
  { table: 'Reports', fields: ['comment_id'], name: 'idx_reports_comment_id' },
  { table: 'Conversations', fields: ['image_id'], name: 'idx_conversations_image_id' },
  { table: 'Conversations', fields: ['buyer_id'], name: 'idx_conversations_buyer_id' },
  { table: 'Conversations', fields: ['seller_id'], name: 'idx_conversations_seller_id' },
  { table: 'Messages', fields: ['sender_id'], name: 'idx_messages_sender_id' },
  { table: 'Followers', fields: ['followed_id'], name: 'idx_followers_followed_id' },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    for (const idx of INDEXES) {
      await queryInterface.addIndex(idx.table, idx.fields, { name: idx.name });
    }
  },
  async down(queryInterface) {
    for (const idx of INDEXES) {
      await queryInterface.removeIndex(idx.table, idx.name);
    }
  },
};
